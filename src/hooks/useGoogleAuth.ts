import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Required by expo-auth-session to close the auth popup/browser on return.
WebBrowser.maybeCompleteAuthSession();

// Platform-specific OAuth 2.0 client IDs from Google Cloud Console.
// - WEB:     used on web AND as the audience on native (backend accepts all).
// - ANDROID: registered with package `com.urbanav.app` + SHA-1 fingerprint.
// - IOS:     registered with bundle id `com.urbanav.app` + URL scheme.
// - EXPO:    web-type client used only when running inside Expo Go (proxy).
const extra = Constants.expoConfig?.extra || {};
const WEB_CLIENT_ID = extra.googleClientIdWeb || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '';
const ANDROID_CLIENT_ID = extra.googleClientIdAndroid || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '';
const IOS_CLIENT_ID = extra.googleClientIdIos || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '';
const EXPO_CLIENT_ID = extra.googleClientIdExpo || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_EXPO || WEB_CLIENT_ID;

// Detect Expo Go runtime. In Expo Go the native URL scheme / SHA-1 do not
// match the production app, so native client IDs cannot be used; instead we
// route through the Expo auth proxy using a web-type client id.
const isExpoGo = (Constants as any).appOwnership === 'expo';

export interface GoogleAuthHookResult {
  response: any;
  promptAsync: () => Promise<boolean>;
  ready: boolean;
  notConfigured: boolean;
  unsupportedRuntime: boolean;
}

export function useGoogleAuth(
  onIdToken: (idToken: string) => void | Promise<void>
): GoogleAuthHookResult {
  const notConfigured = !WEB_CLIENT_ID && !ANDROID_CLIENT_ID && !IOS_CLIENT_ID;
  // Google Sign-In cannot work inside Expo Go on SDK 50+ because the
  // generated redirect URI uses `exp://` which Google rejects. Callers
  // should surface a friendly message in that case.
  const unsupportedRuntime = isExpoGo && Platform.OS !== 'web';

  // Let expo-auth-session pick the correct clientId based on Platform.OS,
  // the same way Google's official guide recommends:
  //   web     -> webClientId
  //   android -> androidClientId (native intent via SHA-1 + package)
  //   ios     -> iosClientId     (native URL scheme)
  // For Expo Go (dev), fall back to the Expo proxy via a web-type clientId.
  // Use 'not-configured' as a safe placeholder for empty client IDs.
  // This prevents Google.useIdTokenAuthRequest() from throwing when a
  // required clientId is empty/undefined (React hooks cannot be wrapped
  // in try-catch or called conditionally). Auth will simply fail at
  // prompt-time, which is handled gracefully below.
  const config: Partial<Google.GoogleAuthRequestConfig> =
    Platform.OS === 'web'
      ? { webClientId: WEB_CLIENT_ID || 'not-configured' }
      : isExpoGo
      ? { clientId: EXPO_CLIENT_ID || 'not-configured' }
      : {
          webClientId: WEB_CLIENT_ID || 'not-configured',
          androidClientId: ANDROID_CLIENT_ID || 'not-configured',
          iosClientId: IOS_CLIENT_ID || 'not-configured',
        };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    config as Google.GoogleAuthRequestConfig
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken =
        (response as any).params?.id_token ||
        (response as any).authentication?.idToken;
      if (idToken) {
        Promise.resolve(onIdToken(idToken)).catch((err) => {
          console.error('[GoogleAuth] Backend verification failed:', err?.message || err);
        });
      } else {
        console.error('[GoogleAuth] No idToken in response:', JSON.stringify(response));
      }
    } else if (response?.type === 'error') {
      const errCode = (response as any).errorCode || '';
      console.error('[GoogleAuth] Auth failed:', response.type, errCode);
    } else if (response?.type === 'dismiss') {
      console.log('[GoogleAuth] Auth dismissed by user');
    }
  }, [response]);

  return {
    response,
    promptAsync: async () => {
      if (!request) {
        console.error('[GoogleAuth] No request available');
        return false;
      }
      try {
        const result = await promptAsync();
        console.log('[GoogleAuth] Prompt result:', result?.type);
        return true;
      } catch (err) {
        console.error('[GoogleAuth] promptAsync error:', err);
        return false;
      }
    },
    ready: !!request,
    notConfigured,
    unsupportedRuntime,
  };
}

/**
 * Google Sign-In helper that works in ALL environments:
 * - Dev build APK → uses native Google Sign-In (best UX)
 * - Expo Go → falls back to web-based Google Sign-In via expo-web-browser
 * - Web → uses standard web Google Sign-In
 *
 * This solves the fundamental limitation that Expo Go cannot use native
 * Google Sign-In due to package name / SHA-1 mismatch.
 */

import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';

declare global {
  interface Window {
    location: { origin: string };
  }
}
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra || {};
const WEB_CLIENT_ID = extra.googleClientIdWeb || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '';
const ANDROID_CLIENT_ID = extra.googleClientIdAndroid || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '';
const IOS_CLIENT_ID = extra.googleClientIdIos || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '';
const EXPO_CLIENT_ID = extra.googleClientIdExpo || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_EXPO || WEB_CLIENT_ID;

const isExpoGo = (Constants as any).appOwnership === 'expo';

export interface GoogleAuthResult {
  promptAsync: () => Promise<void>;
  ready: boolean;
  isExpoGoFallback: boolean;
}

/**
 * Returns a Google auth hook that automatically chooses the right method:
 * - Native (dev build APK): best UX, uses Google Play Services
 * - Web-based (Expo Go): opens in-app browser, still gets idToken
 */
export function useSmartGoogleAuth(
  onIdToken: (idToken: string) => void | Promise<void>
): GoogleAuthResult {
  const notConfigured = !WEB_CLIENT_ID;
  
  // For Expo Go or web, use web-based flow (works everywhere)
  // For dev build, use native flow (better UX)
  const useWebFlow = isExpoGo || Platform.OS === 'web';

  // Web-based config (works in Expo Go AND web)
  const webConfig = {
    clientId: WEB_CLIENT_ID || 'not-configured',
    redirectUri: Platform.OS === 'web'
      ? getWindowOrigin()
      : makeRedirectUri({ scheme: 'urbanav' }),
    scopes: ['openid', 'profile', 'email'],
  };

  // Native config (only works in dev builds with correct package/SHA-1)
  const nativeConfig = {
    webClientId: WEB_CLIENT_ID || 'not-configured',
    androidClientId: ANDROID_CLIENT_ID || 'not-configured',
    iosClientId: IOS_CLIENT_ID || 'not-configured',
    scopes: ['openid', 'profile', 'email'],
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    useWebFlow ? webConfig : nativeConfig
  );

  // Handle response
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken =
        (response as any).params?.id_token ||
        (response as any).authentication?.idToken;
      if (idToken) {
        console.log('[SmartGoogleAuth] Got idToken (mode:', useWebFlow ? 'web' : 'native', ')');
        Promise.resolve(onIdToken(idToken)).catch((err) => {
          console.error('[SmartGoogleAuth] Backend error:', err?.message);
        });
      }
    } else if (response?.type === 'error') {
      console.error('[SmartGoogleAuth] Auth error:', (response as any).errorCode);
    }
  }, [response]);

  return {
    promptAsync: async () => {
      if (!request) {
        Alert.alert('Not Ready', 'Google Sign-In is still loading. Please try again.');
        return;
      }
      try {
        console.log('[SmartGoogleAuth] Starting auth (mode:', useWebFlow ? 'web browser' : 'native', ')');
        await promptAsync();
      } catch (err: any) {
        console.error('[SmartGoogleAuth] Prompt error:', err);
        Alert.alert('Sign-In Failed', err.message || 'Google sign-in failed. Please try again.');
      }
    },
    ready: !!request,
    isExpoGoFallback: useWebFlow,
  };
}

function getWindowOrigin(): string | undefined {
  // @ts-ignore - window exists in web environment
  return typeof window !== 'undefined' ? window.location.origin : undefined;
}

function makeRedirectUri({ scheme }: { scheme: string }) {
  return `${scheme}://oauthredirect`;
}

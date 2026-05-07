import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import auth from '@react-native-firebase/auth';

// Get Google Client IDs from app.json
const GOOGLE_CLIENT_ID_ANDROID = Constants.expoConfig?.extra?.googleClientIdAndroid;
const GOOGLE_CLIENT_ID_WEB = Constants.expoConfig?.extra?.googleClientIdWeb;

// Firebase Web Client ID (from google-services.json)
const FIREBASE_WEB_CLIENT_ID = '264862175673-0iqh5rqd2e0kpkhvs72jt8dgbfu4pf0c.apps.googleusercontent.com';

// Configure redirect URI
const redirectUri = WebBrowser.makeRedirectUri({
  scheme: 'urbanav',
});

/**
 * Custom hook for Firebase Google Sign-In with Expo
 * @param {Function} onSuccess - Callback when sign-in succeeds (receives firebaseToken)
 * @param {Function} onError - Callback when sign-in fails (receives error)
 */
export function useFirebaseGoogleAuth(onSuccess, onError) {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    webClientId: FIREBASE_WEB_CLIENT_ID,
    redirectUri,
    useProxy: true,
  });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[FirebaseGoogleAuth] Starting Google Sign-In...');

      // Trigger the authentication flow
      const result = await promptAsync();

      if (result.type === 'success') {
        console.log('[FirebaseGoogleAuth] Google auth success, exchanging for Firebase token...');

        // Get the ID token from the response
        const { id_token: idToken } = result.params || result.authentication || {};

        if (!idToken) {
          throw new Error('No ID token received from Google');
        }

        // Exchange Google token for Firebase auth
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);

        // Get Firebase token
        const firebaseToken = await userCredential.user.getIdToken();

        console.log('[FirebaseGoogleAuth] Firebase Sign-In successful!');

        // Call success callback with Firebase token
        if (onSuccess) {
          await onSuccess(firebaseToken, userCredential.user);
        }
      } else if (result.type === 'dismiss') {
        console.log('[FirebaseGoogleAuth] User dismissed sign-in');
      } else {
        throw new Error(result.type || 'Sign-in cancelled');
      }
    } catch (error) {
      console.error('[FirebaseGoogleAuth] Error:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [promptAsync, onSuccess, onError]);

  return {
    handleGoogleSignIn,
    loading,
    ready: !!request,
  };
}

/**
 * Firebase Email/Password Sign-In
 */
export const firebaseSignInWithEmail = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const firebaseToken = await userCredential.user.getIdToken();

    return {
      success: true,
      firebaseToken,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Firebase Email/Password Registration
 */
export const firebaseSignUpWithEmail = async (email, password, name) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    // Update display name
    await userCredential.user.updateProfile({ displayName: name });
    
    const firebaseToken = await userCredential.user.getIdToken();

    return {
      success: true,
      firebaseToken,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Firebase Sign Out
 */
export const firebaseSignOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

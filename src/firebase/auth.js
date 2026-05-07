import auth from '@react-native-firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

// Get Google Client IDs from app.json extra config
const GOOGLE_CLIENT_ID_ANDROID = Constants.expoConfig?.extra?.googleClientIdAndroid;
const GOOGLE_CLIENT_ID_WEB = Constants.expoConfig?.extra?.googleClientIdWeb;

// Configure redirect URI for Expo
const redirectUri = WebBrowser.makeRedirectUri({
  scheme: 'urbanav', // Matches the scheme in app.json
});

/**
 * Initialize Google Auth Session for Expo
 */
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    webClientId: GOOGLE_CLIENT_ID_WEB,
    redirectUri,
    useProxy: true, // Use Expo auth proxy
  });

  return { request, response, promptAsync };
};

/**
 * Sign in with Google via Firebase
 * @param {string} idToken - ID token from Expo Google Auth
 */
export const signInWithGoogle = async (idToken) => {
  try {
    if (!idToken) {
      throw new Error('No ID token provided');
    }

    console.log('[Firebase] Signing in with Google token...');

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with Firebase
    const userCredential = await auth().signInWithCredential(googleCredential);
    
    // Get Firebase token
    const firebaseToken = await userCredential.user.getIdToken();
    
    console.log('[Firebase] Google Sign-In successful:', userCredential.user.email);
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        firebaseToken,
      },
    };
  } catch (error) {
    console.error('[Firebase] Google Sign-In Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign in with Email/Password via Firebase
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const firebaseToken = await userCredential.user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        firebaseToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Register with Email/Password via Firebase
 */
export const signUpWithEmail = async (email, password, name) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    // Update display name
    await userCredential.user.updateProfile({ displayName: name });
    
    const firebaseToken = await userCredential.user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        firebaseToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign Out
 */
export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get Current User
 */
export const getCurrentUser = () => {
  return auth().currentUser;
};

/**
 * Listen to Auth State Changes
 */
export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};

/**
 * Send Password Reset Email
 */
export const sendPasswordReset = async (email) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

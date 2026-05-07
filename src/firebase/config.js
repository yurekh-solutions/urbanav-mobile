import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

// Firebase auto-initializes from google-services.json on Android
// Added error handling to prevent crashes
try {
  if (!firebase.apps.length) {
    firebase.initializeApp();
  }
} catch (error) {
  console.warn('[Firebase] Initialization skipped:', error.message);
}

export default firebase;

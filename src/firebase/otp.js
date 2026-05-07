import auth from '@react-native-firebase/auth';

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
 */
export const sendOTP = async (phoneNumber) => {
  try {
    // Ensure phone number has country code
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
    
    // Firebase will automatically send SMS with OTP
    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
    
    return {
      success: true,
      confirmation,
      message: 'OTP sent successfully',
    };
  } catch (error) {
    console.error('Send OTP Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify OTP code
 * @param {object} confirmation - Confirmation object from sendOTP
 * @param {string} code - 6-digit OTP code
 */
export const verifyOTP = async (confirmation, code) => {
  try {
    if (!confirmation) {
      throw new Error('No confirmation object. Please request OTP first.');
    }

    const userCredential = await confirmation.confirm(code);
    const firebaseToken = await userCredential.user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber,
        firebaseToken,
      },
    };
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (phoneNumber) => {
  return await sendOTP(phoneNumber);
};

/**
 * Verify phone number (for linking to existing account)
 */
export const verifyPhoneNumber = async (phoneNumber) => {
  try {
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
    
    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
    
    return {
      success: true,
      confirmation,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Link phone number to existing user
 */
export const linkPhoneNumber = async (confirmation, code) => {
  try {
    const userCredential = await confirmation.confirm(code);
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

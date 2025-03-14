import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PATIENT_AUTH;

// **Step 1: Send Verification Code**
export const sendVerification = async (PID) => {
  try {
    const response = await axios.post(`${API_URL}/send-verification`, { PID });
    return response.data;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

// **Step 2: Verify Code**
export const verifyCode = async (verificationDetails) => {
  try {
    const response = await axios.post(`${API_URL}/verify-code`, verificationDetails);
    return response.data;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

// **Step 3: Reset Password**
export const resetPassword = async (passwordDetails) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, passwordDetails);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

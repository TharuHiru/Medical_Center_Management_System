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
export const verifyCode = async (fullcode) => {
  try {
    const response = await axios.post(`${API_URL}/verify-code`, { fullcode });
    return response.data;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

// **Step 3: Reset Password**
export const setNewPassword = async (password) => {
  try {
    const response = await axios.post(`${API_URL}/set-password`, {password});
    return response.data;
  } catch (error) {
    console.error("Error Creating Account:", error);
    throw error;
  }
};

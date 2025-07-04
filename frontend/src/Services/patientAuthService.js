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
    console.log("Response from verifyCode:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

// **Step 3: Reset Password**
export const setNewPassword = async (password,userName) => {
  try {
    const response = await axios.post(`${API_URL}/set-password`, {password,userName});
    return response.data;
  } catch (error) {
    console.error("Error Creating Account:", error);
    throw error;
  }
};

//patient login
export const patientLogin = async (userName, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      userName: userName, // Correct structure
      password: password
    });
    console.log("Response from patientLogin:", response.data); // Log the response data
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


// fetch patient ID for master ID
export const fetchPatientIDs = async (masterID) => {
  const response = await axios.get(`${API_URL}/fetch-patient-IDs/${masterID}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error("Failed to fetch patient IDs");
  }
};

//get appoinntment details of the patient
export const fetchPatientAppointments = async (patientId) => {
  const response = await axios.get(`${API_URL}/fetch-appointment-details/${patientId}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error("Failed to fetch patient appointments");
  }
};

//get patient profile details
export const fetchPatientProfile = async (patientId) => {
  const response = await axios.get(`${API_URL}/fetch-patient-profile/${patientId}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error("Failed to fetch patient profile");
  }
};
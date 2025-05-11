import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_TEMPORY_PATIENT_AUTH;

// patient signup
export const temporyPatientSignUp = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// patient login
export const temporyPatientLogin = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

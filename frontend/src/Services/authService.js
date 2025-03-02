import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//register doctor step 1 API Call
export const registerDoctorStep1 = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register/step1`,formData);
    return response.data; // Return the response data

  } catch (error) {
    console.error("Registration error:", error);
    return error.response?.data || { success: false, message: "Server error!" };
  }
};

// Register Doctor step 2 API Call
export const registerDoctorStep2 = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register/step2`,formData);
    return response.data; // Return the response data

  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};;


// Doctor Login API Call
export const doctorLogin = async (UserName, password) => {
  // call the function in the node backend
  try {
    const response = await axios.post(`${API_URL}/doctor-login`, {
      UserName,
      password,
    });

    return response.data; // Return the response data
  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};

//Register Assistant API call

export const registerAssistant = async (assistantDetails) => {
  try {
    const response = await axios.post(`${API_URL}/register-assistant`,assistantDetails);
    return response.data; // Return the response data

  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
}
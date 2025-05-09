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

// Assistant Login API Call
export const assistLogin = async (email, password) => {
  // call the function in the node backend
  try {
    const response = await axios.post(`${API_URL}/assistant-login`, {
      email,
      password,
    });

    return response.data; // Return the response data
  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};

// Temporary Patient SignUp API Call
export const temporyPatientSignUp = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/tempory-patient-signup`,formData);
    return response.data; // Return the response data

  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};

// Register Patient API Call
export const registerPatient = async (patientDetails) => {
  try {
    const response = await axios.post(`${API_URL}/register-patient`,patientDetails);
    return response.data; // Return the response data

  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};

// Get master account details
export const getMasterAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/master-accounts`);
    console.log("Response from getMasterAccounts:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};

// change assistant password at first login
export const changeAssistantPassword = async (newPassword, token) => {
  try {
    const response = await axios.post(`${API_URL}/change-assistant-password`,
      { newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};



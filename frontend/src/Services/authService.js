import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//register doctor step 1 API Call
export const registerDoctorStep1 = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/register/step1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    return await response.json();

  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to connect to the server");
  }
};

// Register Doctor step 2 API Call
export const registerDoctorStep2 = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/register/step2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return await response.json();

  } catch (error) {
    throw new Error(error.message || 'Failed to connect to the server');
  }
};


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
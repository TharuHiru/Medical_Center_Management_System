import axios from "axios";

const API_URL = "http://localhost:5000/api/appointments";

// ✅ Create an Appointment 
export const createAppointment = async (patientID, appointmentDate) => {
  try {
    const response = await axios.post(API_URL, {
      patientID,
      appointmentDate,
    });
    return response.data; // ✅ Return success response
  } catch (error) {
    // ✅ Extract backend error message and return as a rejected Promise
    return Promise.reject(error.response?.data?.error || "Something went wrong");
  }
};


// ✅ Get All Appointments
export const getAppointments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};

// ✅ Get all appointments for the doctor
export const getDoctorAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/doctor-view`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return null;
  }
};

// ✅ Admit a Patient
export const admitPatient = async (patientID, appointmentDate) => {
  try {

    const requestData = { patientID, appointmentDate };
    console.log("Sending request:", requestData); // ✅ Log data before sending

    const response = await axios.put(`${API_URL}/admit/`, {
      patientID,
      appointmentDate,
    });
    
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

import axios from "axios";

const API_URL = "http://localhost:5000/api/appointments";

// ✅ Create an Appointment
export const createAppointment = async (patientID, patientName, appointmentDate) => {
  try {
    const response = await axios.post(API_URL, {
      patientID,
      patientName,
      appointmentDate,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Something went wrong");
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

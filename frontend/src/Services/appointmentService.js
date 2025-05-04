import axios from "axios";

const API_URL = "http://localhost:5000/api/appointments";

// ✅ Create an Appointment 
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const createAppointment = async (patientID, appointmentDate) => {
  const docID = `${appointmentDate}_${patientID}`; // unique per day per patient
  const appointmentRef = doc(db, "appointments", docID);

  const existing = await getDoc(appointmentRef);
  if (existing.exists()) {
    throw new Error("Appointment already exists for this patient on this date.");
  }

  await setDoc(appointmentRef, {
    id: patientID,
    appointmentDate,
    status: "pending",
    createdAt: serverTimestamp(),
  });
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

//reomve appointment
export const removeAppointment = async (patientID) => {
  try {
    const response = await axios.delete(`${API_URL}/remove/${patientID}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};
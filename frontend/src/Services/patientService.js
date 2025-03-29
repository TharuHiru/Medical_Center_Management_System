import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PATIENT;

// Function to fetch patients
export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-patients`);
    return response.data;
  } 
  catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

//update patient details
export const updatePatient = async (selectedPatient) => {
  try {
    const response = await axios.put(`${API_URL}/updatePatient`, selectedPatient);
    return response.data;
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};




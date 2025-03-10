import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PATIENT;

// Function to fetch patients
export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-patients`);

    // Log fetched data
    console.log("Fetched Patients Data is here");

    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};




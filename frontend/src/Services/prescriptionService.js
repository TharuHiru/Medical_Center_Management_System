import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PRESCRIPTION_AUTH;

// Save prescription data to the database
export const addPrescription = async (prescriptionPayload) => {
  try {
    const response = await axios.post(`${API_URL}/addPrescription`, prescriptionPayload);

    if (response.data.success) {
      console.log("Prescription saved successfully:", response.data);
      return { success: true, message: "Prescription saved successfully" };
    } else {
      console.warn("Failed to save prescription:", response.data.message || "Unknown error");
      return { success: false, message: "Failed to save prescription" };
    }
  } catch (error) {
    console.error("Error saving prescription:", error);
    return { success: false, message: "Something went wrong while saving prescription" };
  }
};

// Get the alleries of the patient
export const fetchPatientAllergies = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/getPatientAllergies/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient allergies:", error);
    return { success: false, message: "Failed to fetch patient allergies" };
  }
};

// Edit alleries of the patient
export const editPatientAllergies = async (patientId, allergies) => {
  try {
    const response = await axios.put(`${API_URL}/editPatientAllergies/${patientId}`, { allergies });
    return response.data;
  } catch (error) {
    console.error("Error editing patient allergies:", error);
    return { success: false, message: "Failed to edit patient allergies" };
  }
};

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PRESCRIPTION_AUTH;

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

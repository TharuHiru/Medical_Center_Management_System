import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// function to fetch patient email
export const getPatientEmail = async (patientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/emails/${patientId}/email`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch email');
    }
    return response.data.email;
  } catch (error) {
    console.error("Error fetching patient email:", error);
    throw error;
  }
};

export const sendPrescriptionEmail = async (prescriptionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/emails/prescriptions`, prescriptionData);
    return response.data;
  } catch (error) {
    console.error("Error sending prescription email:", error);
    throw error;
  }
};

export const sendReceiptEmail = async (receiptData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/emails/receipts`, receiptData);
    return response.data;
  } catch (error) {
    console.error("Error sending receipt email:", error);
    throw error;
  }
};

export const generatePrescriptionPdf = async (htmlContent) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/emails/generate-pdf`, { htmlContent });
    return response.data;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};


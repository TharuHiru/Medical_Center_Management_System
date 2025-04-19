import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_BILLING;

// function to get inventory details by medicine ID
export const fetchInventoryByMedicineID = async (medicine_ID) => {
  try {
    const response = await axios.get(`${API_URL}/getInventoryByMedicineID/${medicine_ID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory by medicine ID:", error);
    throw error;
  }
};
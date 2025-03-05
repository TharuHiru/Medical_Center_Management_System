import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL1;

//register Inventory API Call
export const registerInventory = async (inventoryDetails) => {
  try {
    const response = await axios.post(`${API_URL}/register-inventory`,inventoryDetails);
    return response.data; // Return the response data

  } catch (error) {
    return error.response?.data || { success: false, message: "Server error!" };
  }
};
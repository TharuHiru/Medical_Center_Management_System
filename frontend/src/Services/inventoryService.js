import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_INVENTORY;

// Function to fetch patients
export const fetchInventory = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-inventory`);

    // Log fetched data
    console.log("Fetched Inventory Data is here");

    return response.data;
  } catch (error) {
    console.error("Error fetching invetory details:", error);
    throw error;
  }
};

// Function to add new INVENTORY
export const registerInventory = async (inventoryDetails) => {
  try {
    const response = await axios.post(`${API_URL}/register-inventory`, inventoryDetails);
    return response.data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};



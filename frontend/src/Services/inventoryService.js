import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_INVENTORY;

// Function to fetch Inventiry details
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

// Function to fetch Medicine Category
export const fetchMedicineCategory = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-medicine-category`);

    // Log fetched data
    console.log("Fetched Medicine Category Data is here");

    return response.data;
  } catch (error) {
    console.error("Error fetching Medicine Category:", error);
    throw error;
  }
};

// Function to add new medicine category
export const addMedicineCategory = async (categoryDetails) => {
  try {
    // Assuming categoryDetails is an object like { medicine_name: 'New Category' }
    const response = await axios.post(`${API_URL}/add-medicine-category`, categoryDetails);
    return response.data;  
  } catch (error) {
    console.error("Error Adding Category:", error);
    throw error; // Rethrow the error if you need to handle it elsewhere
  }
};



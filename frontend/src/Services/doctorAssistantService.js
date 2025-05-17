import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_ASSISTANT;

// Function to fetch patients
export const fetchAssistants = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-assistants`);
    return response.data;
  } 
  catch (error) {
    console.error("Error fetching Assistants:", error);
    throw error;
  }
};

export const updateAssistant = async (id, assistantData) => {
  try {
    const response = await axios.put(`${API_URL}/assistants/${id}`, assistantData);
    return response.data;
  } catch (error) {
    console.error("Error updating assistant:", error);
    throw error;
  }
};

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/dashboard";

const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export default {
  getDashboardStats
};

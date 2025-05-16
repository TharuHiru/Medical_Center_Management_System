import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_REPORTS; 

export const fetchReport = async (reportType, dateRange) => {
  try {
    const response = await axios.post(`${API_URL}/report`, {
      reportType,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });

    if (response.data.success) {
      console.log("Report fetched successfully:", response.data);
      return { 
        success: true, 
        message: "Report fetched successfully",
        data: response.data.data 
      };
    } else {
      console.warn("Failed to fetch report:", response.data.message || "Unknown error");
      return { 
        success: false, 
        message: response.data.message || "Failed to fetch report" 
      };
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    return { 
      success: false, 
      message: "Something went wrong while fetching report" 
    };
  }
};
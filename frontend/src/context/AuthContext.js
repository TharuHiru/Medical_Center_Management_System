"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create authentication context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'patient', 'doctor', or 'assistant'
  const [patientID, setPatientID] = useState(null); // Stores patient ID only for patient login

  // Load saved user details on page refresh
  useEffect(() => {
    const savedUserType = localStorage.getItem("userType");
    const savedPatientID = localStorage.getItem("patientID");

    if (savedUserType) {
      setUserType(savedUserType);
    }
    if (savedUserType === "patient" && savedPatientID) {
      setPatientID(savedPatientID);
    }
  }, []);

  // Login function
  const login = (type, id = null) => {
    setUserType(type);
    localStorage.setItem("userType", type);

    if (type === "patient" && id) {
      setPatientID(id);
      localStorage.setItem("patientID", id);
    } else {
      setPatientID(null);
      localStorage.removeItem("patientID");
    }
  };

  // Logout function
  const logout = () => {
    setUserType(null);
    setPatientID(null);
    localStorage.removeItem("userType");
    localStorage.removeItem("patientID");
  };

  return (
    <AuthContext.Provider value={{ userType, patientID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

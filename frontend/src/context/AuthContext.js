"use client";
import { userAgent } from "next/server";
import { createContext, useContext, useEffect, useState } from "react";

// Create authentication context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'patient', 'doctor', or 'assistant'
  const [patientID, setPatientID] = useState(null); // Stores patient ID only for patient login
  const [doctorID, setDoctorID] = useState(null);


  // Load saved user details on page refresh
  useEffect(() => {
    const savedUserType = localStorage.getItem("userType");
    const savedPatientID = localStorage.getItem("userName");
    const savedDoctorID = localStorage.getItem("doctorID");


    if (savedUserType) {
      setUserType(savedUserType);
    }
    if (savedUserType === "patient" && savedPatientID) {
      setPatientID(savedPatientID);
    }
    if (savedUserType === "doctor" && savedDoctorID) 
      setDoctorID(savedDoctorID);

  }, []);

  // Login function
  const login = (type, id = null) => {
    setUserType(type);
    localStorage.setItem("userType", type);

    if (type === "patient" && id) {
      setPatientID(id);
      localStorage.setItem("userName", id);
    } else {
      setPatientID(null);
      localStorage.removeItem("userName");
    }

    if (type === "doctor" && id) {
      setDoctorID(id);
      localStorage.setItem("doctorID", id);
    } else {
      setDoctorID(null);
      localStorage.removeItem("doctorID");
    }
  };

  // Logout function
  const logout = () => {
    setUserType(null);
    setPatientID(null);
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ userType, userName, doctorID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

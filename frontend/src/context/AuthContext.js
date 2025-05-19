"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create authentication context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'patient', 'doctor', or 'assistant'
  const [patientID, setPatientID] = useState(null); 
  const [doctorID, setDoctorID] = useState(null);
  const [masterID , setMasterID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [assistantID, setAssistantID] = useState(null);
  const [token, setToken] = useState(null);

  // Load saved user details on page refresh
  useEffect(() => {
    const savedUserType = localStorage.getItem("userType");
    const savedPatientID = localStorage.getItem("userName");
    const savedDoctorID = localStorage.getItem("doctorID");
    const savedMasterID = localStorage.getItem("masterID");
    const savedUserName = localStorage.getItem("userName");
    const savedAssistantID = localStorage.getItem("assistantID");

    if (savedUserType === "patient" && savedMasterID) {
      setMasterID(savedMasterID);
    }
    if (savedUserType === "assistant" && savedAssistantID) {
      setAssistantID(savedAssistantID);
    }
    if (savedUserType) {
      setUserType(savedUserType);
    }
    if (savedUserType === "patient" && savedPatientID) {
      setPatientID(savedPatientID);
    }
    if (savedUserType === "doctor" && savedDoctorID) 
      setDoctorID(savedDoctorID);
    if (savedUserName) setUserName(savedUserName);
    if (savedUserName) setUserName(savedUserName);

  }, []);

  const login = (type, id = null, masterIDVal = null, userDetails = null) => {
    if (token) {
    setToken(token);
    localStorage.setItem("token", token);
  }
    setUserType(type);
    localStorage.setItem("userType", type);
  
    if (type === "patient" && id) {
      setPatientID(id);
      localStorage.setItem("userName", id);
      if (masterIDVal) {
        setMasterID(masterIDVal);
        localStorage.setItem("masterID", masterIDVal);
      }

    } else if (type === "doctor" && id) {
      setDoctorID(id);
      localStorage.setItem("doctorID", id);
      if (userDetails?.firstName) {
        const fullName = `${userDetails.firstName} ${userDetails.lastName}`;
        setUserName(fullName);
        localStorage.setItem("userName", fullName);
      }

    } else if (type === "assistant" && id) {
      setAssistantID(id);
      localStorage.setItem("assistantID", id);
      if (userDetails?.firstName) {
        const fullName = `${userDetails.firstName} ${userDetails.lastName}`;
        setUserName(fullName);
        localStorage.setItem("userName", fullName);
      }

    } else {
      setPatientID(null);
      setDoctorID(null);
      setAssistantID(null);
      setMasterID(null);
      localStorage.removeItem("userName");
      localStorage.removeItem("doctorID");
      localStorage.removeItem("assistantID");
      localStorage.removeItem("masterID");
    }
  };
  
  // Logout function
  const logout = () => {
    setToken(null);
    setUserType(null);
    setPatientID(null);
    setDoctorID(null);
    setAssistantID(null);
    setMasterID(null);

    localStorage.removeItem("token"); 
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("doctorID");
    localStorage.removeItem("assistantID");
    localStorage.removeItem("masterID");
  };
  
  return (
    <AuthContext.Provider value={{ userType, userName, doctorID, patientID, masterID, token, assistantID,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

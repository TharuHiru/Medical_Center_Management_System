"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { createAppointment } from "../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar from "../../../components/patientSideBar";
import { fetchPatientIDs } from "../../../services/patientAuthService";

export default function ProfilePage() {
  const { masterID } = useAuth();

  const [patientList, setPatientList] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      if (!masterID) {
        console.warn("masterID not ready, skipping fetch");
        return;
      }

      try {
        const data = await fetchPatientIDs(masterID);
        console.log("Fetched Patients:", data);
        setPatientList(data);
        if (data.length > 0) {
          setSelectedPatientID(data[0].patient_ID);
        }
      } catch (err) {
        console.error("Failed to load patient IDs", err);
        toast.error("Failed to load patient IDs");
      }
    };

    loadPatients();
  }, [masterID]);

  //Handle logout function
  const logout = () => {
    console.log("Logged out");
  };

  const patientIDsOwnedByUser = patientList.map((p) => p.patient_ID);

  return (
    <div>
      <PatientSidebar  onLogout={logout} />
      <div className="content-area" style={{ marginLeft: '260px' }}>
      <div className="container mt-4">
        <h3>Patients List</h3>
        {patientList.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <ul className="list-group">
            {patientList.map((patient) => (
              <li key={patient.patient_ID} className="list-group-item">
                Patient ID: {patient.patient_ID}
                {/* If there's a name or other info, show it here too */}
                {patient.name && <span> - {patient.name}</span>}
              </li>
            ))}
          </ul>
        )}
        <ToastContainer />
      </div>
    </div>
    </div>
  );
  
}

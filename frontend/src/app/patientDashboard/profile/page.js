"use client";
import React, { useState, useEffect ,useRef} from "react";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import PatientSidebar from "@/components/patientSideBar";
import { fetchPatientIDs, fetchPatientAppointments ,fetchPatientProfile } from "@/services/patientAuthService";
import PatientProfileView from "@/components/patientAppointments";
import '@/Styles/profileTab.css'
import ProtectedRoute from '@/components/protectedRoute';
import "@/Styles/AssistantDashboard.css";

export default function ProfilePage() {
  const { masterID } = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [appointmentsByPatient, setAppointmentsByPatient] = useState({});


  useEffect(() => {
    const loadPatients = async () => {
      if (!masterID) {
        console.warn("masterID not ready, skipping fetch");
        return;
      }

      try {
        const data = await fetchPatientIDs(masterID);
        setPatientList(data);
        if (data.length > 0) {
          setActiveTab(data[0].patient_ID);
        }
      } catch (err) {
        console.error("Failed to load patient IDs", err);
        toast.error("Failed to load patient IDs");
      }
    };

    loadPatients();
  }, [masterID]);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!activeTab) return;

      

      try {
      const profile = await fetchPatientProfile(activeTab);
      setSelectedPatientDetails(profile);

        const data = await fetchPatientAppointments(activeTab);
        setAppointmentsByPatient((prev) => ({
          ...prev,
          [activeTab]: data,
        }));
      } catch (err) {
        console.error("Failed to load appointments", err);
        toast.error("Failed to load appointment details");
      }
    };

    loadAppointments();
  }, [activeTab]);

  return (
    <>
    <ProtectedRoute>
    <div className="dashboard-container">
      <PatientSidebar /> 
      <div className="content-area container mt-4" >
        <div className="container mt-4">
          <h3 className="mb-4">Family Patient Profiles</h3>
          {patientList.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            <>
              <ul className="nav nav-tabs">
                {patientList.map((patient) => (
                  <li className="nav-item" key={patient.patient_ID}>
                    <button
                      className={`nav-link ${activeTab === patient.patient_ID ? "active" : ""}`}
                      onClick={() => setActiveTab(patient.patient_ID)}
                    >
                      {patient.firstName} {patient.lastName}
                    </button>
                  </li>
                ))}
              </ul>              
              <div className="tab-content mt-3">
                 {selectedPatientDetails && (
                    <div className="card mb-3 p-3">
                      <h4>Patient Information</h4>
                      <br></br>
                      <p><strong>Patient ID : </strong> {selectedPatientDetails.patient_ID}</p>
                      <p><strong>Name : </strong>{selectedPatientDetails.title} {selectedPatientDetails.firstName} {selectedPatientDetails.lastName}</p>
                      <p><strong>Gender : </strong> {selectedPatientDetails.gender}</p>
                      <p><strong>DOB : </strong> {selectedPatientDetails.DOB}</p>
                      <p><strong>Address : </strong> {selectedPatientDetails.house_no}{selectedPatientDetails.addr_line_1}{selectedPatientDetails.addr_line_2}</p>
                      <p><strong>Contact : </strong> {selectedPatientDetails.contactNo}</p>
                      <p><strong>Email : </strong> {selectedPatientDetails.email}</p>
                    </div>
                  )}

                  {activeTab && appointmentsByPatient[activeTab] && (
                    <PatientProfileView
                      patient={{ patient_ID: activeTab }}
                      appointments={appointmentsByPatient[activeTab]}
                    />
                  )}
              </div>
            </>
          )}
        </div>
        <ToastContainer />
      </div>
      </div>
      </ProtectedRoute>
    </>
  );
}

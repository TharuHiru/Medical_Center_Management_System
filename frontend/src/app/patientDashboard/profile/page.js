"use client";
import React, { useState, useEffect ,useRef} from "react";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import PatientSidebar from "@/components/patientSideBar";
import { fetchPatientIDs, fetchPatientAppointments } from "../../../services/patientAuthService";
import PatientProfileView from "@/components/patientAppointments";
import '@/Styles/profileTab.css'

export default function ProfilePage() {
  const { masterID } = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [appointmentsByPatient, setAppointmentsByPatient] = useState({});
  const [collapsedAppointments, setCollapsedAppointments] = useState({});
  const appointmentRef = useRef(null);

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

  const logout = () => {
    console.log("Logged out");
  };

  const toggleCollapse = (index) => {
    setCollapsedAppointments((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      <PatientSidebar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>
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
                {patientList.map((patient) =>
                  activeTab === patient.patient_ID ? (
                    <div className="tab-pane active" key={patient.patient_ID}>
                      <PatientProfileView patient={patient} />
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

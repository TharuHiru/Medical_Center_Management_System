"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar from "../../../components/patientSideBar";
import { fetchPatientIDs } from "../../../services/patientAuthService";

export default function ProfilePage() {
  const { masterID } = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [activeTab, setActiveTab] = useState("");

  //Get the Master ID
  useEffect(() => {
    const loadPatients = async () => {
      if (!masterID) {
        console.warn("masterID not ready, skipping fetch");
        return;
      }

      try {
        const data = await fetchPatientIDs(masterID);
        setPatientList(data);
        console.log("Patient List:", data);
        if (data.length > 0) {
          setActiveTab(data[0].patient_ID); // Default to first tab
        }
      } catch (err) {
        console.error("Failed to load patient IDs", err);
        toast.error("Failed to load patient IDs");
      }
    };

    loadPatients();
  }, [masterID]);

  const logout = () => {
    console.log("Logged out");
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
                      className={`nav-link ${
                        activeTab === patient.patient_ID ? "active" : ""
                      }`}
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
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">
                            {patient.firstName} {patient.lastName}
                          </h5>
                          <br></br>
                          <p><strong>Patient ID:</strong> {patient.patient_ID}</p>
                          <p><strong>Name : </strong> {patient.title} {patient.firstName} {patient.lastName}</p>
                          <p><strong>Contact : </strong> {patient.contactNo}</p>
                          <p><strong>Gender : </strong> {patient.gender}</p>
                          <p><strong>Date Of Birth : </strong> {patient.DOB}</p>
                          <p><strong>Address : </strong> {patient.house_no} , {patient.addr_line_1} , {patient.addr_line_2}</p>
                          <p><strong>Email : </strong> {patient.email}</p>
                        </div>
                      </div>
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

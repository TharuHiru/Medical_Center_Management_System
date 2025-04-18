"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar from "../../../components/patientSideBar";
import { fetchPatientIDs,fetchPatientAppointments } from "../../../services/patientAuthService";

export default function ProfilePage() {
  const { masterID } = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [appointmentsByPatient, setAppointmentsByPatient] = useState({});

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

  useEffect(() => {
    const loadAppointments = async () => {
      if (!activeTab) return;
  
      try {
        const data = await fetchPatientAppointments(activeTab);
        setAppointmentsByPatient((prev) => ({
          ...prev,
          [activeTab]: data
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
                          <table>
                            <tbody>
                              <tr>
                                <td>Patient ID:</td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={patient.patient_ID} />
                                </td>
                              </tr>
                              <tr>
                                <td>Name :</td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={`${patient.title} ${patient.firstName} ${patient.lastName}`} />
                                </td>
                              </tr>
                              <tr>
                                <td>Contact No:</td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={patient.contactNo} />
                                </td>
                              </tr>
                              <tr>
                                <td>Gender :</td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={patient.gender} />
                                </td>
                              </tr>
                              <tr>
                                <td>Date Of Birth :</td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={patient.DOB} />
                                </td>
                              </tr>
                              <tr>
                              <td>Address : </td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={`${patient.house_no}, ${patient.addr_line_1}, ${patient.addr_line_2}`} />
                                </td> 
                              </tr>
                              <tr>
                              <td>Email : </td>
                                <td>
                                  <input type="text" className="form-control" readOnly value={patient.email} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </div>

        <h5 className="mt-4">Appointments</h5>
{appointmentsByPatient[activeTab]?.length > 0 ? (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Doctor</th>
        <th>Reason</th>
      </tr>
    </thead>
    <tbody>
      {appointmentsByPatient[activeTab].map((appt, index) => (
        <tr key={index}>
          <td>{appt.date}</td>
          <td>{appt.time}</td>
          <td>{appt.doctorName}</td>
          <td>{appt.reason}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No appointments found.</p>
)}


        <ToastContainer />
      </div>
    </>
  );
}

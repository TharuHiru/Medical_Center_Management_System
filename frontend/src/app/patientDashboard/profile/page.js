"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar from "../../../components/patientSideBar";
import { fetchPatientIDs, fetchPatientAppointments } from "../../../services/patientAuthService";

export default function ProfilePage() {
  const { masterID } = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [appointmentsByPatient, setAppointmentsByPatient] = useState({});
  const [selectedAppointmentIndex, setSelectedAppointmentIndex] = useState(0);
  const [collapsedAppointments, setCollapsedAppointments] = useState({}); // Track collapsed states

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

  const logout = () => {
    console.log("Logged out");
  };

  useEffect(() => {
    setSelectedAppointmentIndex(0);
  }, [activeTab]);

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

  // Function to toggle collapse state
  const toggleCollapse = (date) => {
    setCollapsedAppointments((prevState) => ({
      ...prevState,
      [date]: !prevState[date], // Toggle the collapse state for the specific date
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
                          <br />
                          <table>
                            <tbody>
                              <tr>
                                <td>Patient ID:</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={patient.patient_ID}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Name :</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={`${patient.title} ${patient.firstName} ${patient.lastName}`}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Contact No:</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={patient.contactNo}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Gender :</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={patient.gender}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Date Of Birth :</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={patient.DOB}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Address : </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={`${patient.house_no}, ${patient.addr_line_1}, ${patient.addr_line_2}`}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Email : </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={patient.email}
                                  />
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

          <h5 className="mt-4">Appointments</h5>
          {appointmentsByPatient[activeTab]?.length > 0 ? (
            <>
              {appointmentsByPatient[activeTab].map((appt, index) => {
                const formattedDate = new Date(appt.date).toLocaleDateString();
                return (
                  <div key={index} className="mb-3">
                    <button
                      className="btn btn-secondary w-100 text-left"
                      onClick={() => toggleCollapse(formattedDate)}
                    >
                      {collapsedAppointments[formattedDate] ? "▲" : "▼"}{" "}
                      {formattedDate} - {appt.time}
                    </button>

                    <div
                      className={`mt-2 ${collapsedAppointments[formattedDate] ? "collapse" : ""}`}
                    >
                      <div className="card">
                        <div className="card-body">
                          <h6><strong>Appointment Details</strong></h6>
                          <p><strong>Date:</strong> {formattedDate}</p>
                          <p><strong>Time:</strong> {appt.time}</p>
                          <p><strong>Doctor:</strong> {appt.doctorName || "N/A"}</p>
                          <p><strong>Reason:</strong> {appt.reason || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p>No appointments found.</p>
          )}
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

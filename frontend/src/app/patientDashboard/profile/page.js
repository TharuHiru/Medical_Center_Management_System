"use client";
import React, { useState, useEffect ,useRef} from "react";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar from "../../../components/patientSideBar";
import { fetchPatientIDs, fetchPatientAppointments } from "../../../services/patientAuthService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaCalendarCheck } from "react-icons/fa";
import '../../../Styles/profileTab.css'

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
                      <div className="card">
                        <div className="card-body">
                          <Container>
                          <div className="d-flex justify-content-end mb-0">
                              <button
                                className="btn btn-primary allergy-btn d-flex align-items-center"
                                onClick={() => {
                                  appointmentRef.current?.scrollIntoView({ behavior: "smooth" });
                                }}
                              >
                                <FaCalendarCheck className="me-2" />
                                View Appointments
                              </button>
                            </div>
                            <Row className="mb-3">
                              <Col>
                                <label><strong>Patient ID:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={patient.patient_ID}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>Name:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={`${patient.title} ${patient.firstName} ${patient.lastName}`}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>Contact:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={patient.contactNo}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>Gender:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={patient.gender}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>DOB:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={patient.DOB}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>Allergies:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={`${patient.allergies}`}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>Address:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={`${patient.house_no}, ${patient.addr_line_1}, ${patient.addr_line_2}`}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <label><strong>Email:</strong></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={patient.email}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                              <hr></hr>
                              <div ref={appointmentRef}>
                                <h3 className="mt-4">Past Appointments Details</h3>
                                {appointmentsByPatient[activeTab]?.length > 0 ? (
                                  appointmentsByPatient[activeTab].map((appt, index) => {
                                    const formattedDate = new Date(appt.date).toLocaleDateString();
                                    return (
                                      <div key={index} className="mb-3">
                                      <button
                                        className="btn btn-secondary loginBtn w-100 d-flex justify-content-between align-items-center"
                                        onClick={() => toggleCollapse(index)}
                                      >
                                        <span>{formattedDate}</span>
                                        <span>{collapsedAppointments[index] ? "▼" : "▲"}</span>
                                      </button>

                                        <div className={`mt-2 ${collapsedAppointments[index] ? "collapse" : ""}`}>
                                          <div className="card">
                                            <div className="card-body">
                                              <p><strong>Date :</strong> {formattedDate}</p>
                                              <p><strong>Diagnosis :</strong> {appt.prescription.Diagnosis}</p>
                                              <p><strong>Other Details:</strong> {appt.prescription.other || "N/A"}</p>
                                              <p><strong><u>Medicines</u></strong></p>

                                              {appt.medicines && appt.medicines.length > 0 ? (
                                                  <ul>
                                                    {appt.medicines.map((med, idx) => (
                                                      <React.Fragment key={idx}>
                                                        <li>
                                                          <strong>Medicine Name :</strong> {med.medicine_name} <br />
                                                          <strong>Dosage :</strong> {med.Dosage || "N/A"}
                                                        </li>
                                                        <br />
                                                      </React.Fragment>
                                                    ))}
                                                  </ul>
                                                ) : (
                                                  <p>No medicines found.</p>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p>No appointments found.</p>
                                )}
                                </div>
                              </Col>
                            </Row>
                          </Container>
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

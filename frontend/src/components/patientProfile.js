"use client";
import React, { useEffect, useState, useRef } from "react";
import { fetchPatientAppointments } from "@/services/patientAuthService";
import { Container, Row, Col } from "react-bootstrap";
import { FaCalendarCheck } from "react-icons/fa";
import { toast } from "react-toastify";

export default function PatientProfileView({ patient }) {
  const [appointments, setAppointments] = useState([]);
  const [collapsedAppointments, setCollapsedAppointments] = useState({});
  const appointmentRef = useRef(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchPatientAppointments(patient.patient_ID);
        
        if (data && data.length === 0) {
          // No appointments found, no need to show toast
          setAppointments([]); 
        } else {
          setAppointments(data); // Load appointments if available
        }
      } catch (err) {
        console.error("Failed to load appointments", err);      }
    };

    if (patient?.patient_ID) {
      loadAppointments();
    }
  }, [patient]);

  const toggleCollapse = (index) => {
    setCollapsedAppointments((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
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
              <input type="text" className="form-control" readOnly value={patient.patient_ID} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>Name:</strong></label>
              <input type="text" className="form-control" readOnly value={`${patient.title} ${patient.firstName} ${patient.lastName}`} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>Contact:</strong></label>
              <input type="text" className="form-control" readOnly value={patient.contactNo} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>Gender:</strong></label>
              <input type="text" className="form-control" readOnly value={patient.gender} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>DOB:</strong></label>
              <input type="text" className="form-control" readOnly value={patient.DOB} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>Allergies:</strong></label>
              <input type="text" className="form-control" readOnly value={patient.allergies || "" } />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>Address:</strong></label>
              <input type="text" className="form-control" readOnly value={`${patient.house_no}, ${patient.addr_line_1}, ${patient.addr_line_2}`} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label><strong>Email:</strong></label>
              <input type="text" className="form-control" readOnly value={patient.email} />
            </Col>
          </Row>

          <Row>
            <Col>
              <hr />
              <div ref={appointmentRef}>
                <h3 className="mt-4">Past Appointments Details</h3>
                {appointments.length > 0 ? (
                  appointments.map((appt, index) => {
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
                              <p><strong>Diagnosis :</strong> {appt.prescription ? appt.prescription.Diagnosis : "N/A"} </p>
                              <p><strong>Other Details:</strong> {appt.prescription ? appt.prescription.other : "N/A"}</p>
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
  );
}

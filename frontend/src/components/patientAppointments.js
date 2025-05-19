"use client";
import React, { useEffect, useState } from "react";
import { fetchPatientAppointments } from "@/services/patientAuthService";
import { Container, Row, Col } from "react-bootstrap";
import { FaCalendarCheck } from "react-icons/fa";

export default function PatientAppointments({ patient }) {
  const [appointments, setAppointments] = useState([]);
  const [collapsedAppointments, setCollapsedAppointments] = useState({});

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchPatientAppointments(patient.patient_ID);
        if (data && data.length === 0) {
          setAppointments([]); 
        } else {
          // Sort appointments by date in descending order (newest first)
          const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setAppointments(sortedData);
          
          // Initialize all appointments as collapsed
          const initialCollapsedState = {};
          sortedData.forEach((_, index) => {
            initialCollapsedState[index] = true;
          });
          setCollapsedAppointments(initialCollapsedState);
        }
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
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
          <Row>
            <Col>
              <h3>Appointments for {patient.firstName} {patient.lastName}</h3>
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
                        <span>{collapsedAppointments[index] ? "▲" : "▼"}</span>
                      </button>

                      <div className={`mt-2 ${collapsedAppointments[index] ? "collapse" : ""}`}>
                        <div className="card">
                          <div className="card-body">
                            <p><strong>Date:</strong> {formattedDate}</p>
                            <p><strong>Diagnosis:</strong> {appt.prescription?.Diagnosis || "N/A"}</p>
                            <p><strong>Other Details:</strong> {appt.prescription?.other || "N/A"}</p>
                            <p><strong><u>Medicines</u></strong></p>

                            {appt.medicines?.length > 0 ? (
                              <ul>
                                {appt.medicines.map((med, idx) => (
                                  <li key={idx}>
                                    <strong>Medicine Name:</strong> {med.medicine_name} <br />
                                    <strong>Dosage:</strong> {med.Dosage || "N/A"}
                                  </li>
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
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import { fetchPatientAppointments } from "@/services/patientAuthService";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaCalendarCheck, FaSearch, FaChevronDown, FaChevronUp, FaPills, FaNotesMedical } from "react-icons/fa";
import "@/Styles/patientAppointments.css";

export default function PatientAppointments({ patient }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [collapsedAppointments, setCollapsedAppointments] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPatientAppointments(patient.patient_ID);
        if (data && data.length === 0) {
          setAppointments([]);
          setFilteredAppointments([]);
        } else {
          const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setAppointments(sortedData);
          setFilteredAppointments(sortedData);
          
          const initialCollapsedState = {};
          sortedData.forEach((_, index) => {
            initialCollapsedState[index] = true;
          });
          setCollapsedAppointments(initialCollapsedState);
        }
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (patient?.patient_ID) {
      loadAppointments();
    }
  }, [patient]);

  useEffect(() => {
    if (searchDate) {
      const filtered = appointments.filter(appt => {
        const selectedDate = new Date(searchDate);
        const appointmentDate = new Date(appt.date);
        return (
          selectedDate.getFullYear() === appointmentDate.getFullYear() &&
          selectedDate.getMonth() === appointmentDate.getMonth() &&
          selectedDate.getDate() === appointmentDate.getDate()
        );
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchDate, appointments]);

  const toggleCollapse = (index) => {
    setCollapsedAppointments((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="patient-appointments-container">
      <div className="patient-appointments-card">
        <div className="card-body p-4">
          <Container>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="appointments-title">
                    <FaCalendarCheck className="title-icon" />
                    Appointments for {patient.firstName} {patient.lastName}
                  </h3>
                </div>
                
                <div className="search-container mb-4">
                  <Form.Group controlId="searchDate">
                    <div className="input-group">
                      <span className="input-group-text search-icon-container">
                        <FaSearch className="search-icon" />
                      </span>
                      <Form.Control
                        type="date"
                        placeholder="Search by date..."
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="search-input"
                      />
                      {searchDate && (
                        <button 
                          className="btn btn-outline-secondary clear-button" 
                          onClick={() => setSearchDate("")}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </Form.Group>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  <div className="appointment-list">
                    {filteredAppointments.map((appt, index) => {
                      const formattedDate = formatDate(appt.date);
                      return (
                        <div key={index} className="appointment-item">
                          <button
                            className="appointment-header"
                            onClick={() => toggleCollapse(index)}
                          >
                            <div className="appointment-header-content">
                              <div className="date-badge">
                                {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="appointment-info">
                                <h5 className="appointment-date">{formattedDate}</h5>
                                <small className="appointment-diagnosis">
                                  {appt.prescription?.Diagnosis || "No diagnosis recorded"}
                                </small>
                              </div>
                            </div>
                            <span className="collapse-icon">
                              {collapsedAppointments[index] ? <FaChevronDown /> : <FaChevronUp />}
                            </span>
                          </button>

                          <div className={`appointment-details ${collapsedAppointments[index] ? "collapsed" : ""}`}>
                            <div className="details-card">
                              <div className="details-card-body">
                                <div className="row">
                                  <div className="col-md-6 diagnosis-section">
                                    <h5 className="section-title">
                                      <FaNotesMedical className="section-icon" />
                                      Diagnosis Details
                                    </h5>
                                    <div className="diagnosis-info">
                                      <label>Diagnosis</label>
                                      <p>{appt.prescription?.Diagnosis || "N/A"}</p>
                                    </div>
                                    <div className="notes-info">
                                      <label>Notes</label>
                                      <p>{appt.prescription?.other || "N/A"}</p>
                                    </div>
                                  </div>
                                  <div className="payment-info">
                                    <label>Payment Amount</label>
                                    <p className="payment-amount">
                                      {appt.prescription?.payment_amount ? 
                                        `Rs. ${appt.prescription.payment_amount.toFixed(2)}` : 
                                        "No payment recorded"}
                                    </p>
                                  </div>
                                  
                                  <div className="col-md-6 medicines-section">
                                    <h5 className="section-title">
                                      <FaPills className="section-icon" />
                                      Prescribed Medicines
                                    </h5>
                                    {appt.medicines?.length > 0 ? (
                                      <div className="medicine-list">
                                        {appt.medicines.map((med, idx) => (
                                          <div key={idx} className="medicine-item">
                                            <h6 className="medicine-name">{med.medicine_name}</h6>
                                            <div className="medicine-details">
                                              <div className="dosage-info">
                                                <label>Dosage</label>
                                                <p>{med.Dosage || "Not specified"}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="no-medicines-alert">
                                        No medicines were prescribed for this appointment.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaCalendarCheck className="empty-state-icon" />
                    <h4>No appointments found</h4>
                    <p className="empty-state-message">
                      {searchDate ? "Try a different date" : "No appointments have been scheduled yet"}
                    </p>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}
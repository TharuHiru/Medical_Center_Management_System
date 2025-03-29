"use client";

import React, { useState, useEffect } from 'react';
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import { getDoctorAppointments,admitPatient } from "../../../services/appointmentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorNavBar from '../../../components/doctorSideBar';



function DoctorQueue() {
  const [appointments, setAppointments] = useState([]);

  // ✅ Logout function (Dummy Function)
const logout = () => {
  toast.info("Logging out...");
  // Add actual logout logic here
};

// ✅ Fetch the patient queue for the doctor
const fetchAppointments = async () => {
  try {
    const data = await getDoctorAppointments();
    if (!data) {
      toast.error("Failed to fetch appointments");
      return;
    }
    setAppointments(data);
  } catch (error) {
    toast.error("Error fetching appointments");
  }
};

useEffect(() => {
  fetchAppointments();
}, []);

// ✅ Handle "Admit" button click
const handleAdmit = async (appointment) => {
  try {
    const response = await admitPatient(appointment.id, appointment.appointmentDate);
    if (response.success) {
      toast.success("Patient admitted successfully!");
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === appointment.id ? { ...appt, status: "admitted" } : appt))
      );
      await fetchAppointments(); // ✅ Fetch latest appointments
    } else {
      toast.error(response.error || "Failed to admit patient.");
    }
  } catch (error) {
    toast.error("Error admitting patient.");
  }
};

  return (
    <div className="dashboard-container">
      <DoctorNavBar onLogout={logout} />
      <div className="content-area">
        <div className="col-md-9 mt-4">
          <h2 className="text-center">Patient Queue for Doctor</h2>

          <div className="list-group">
            {appointments.map((appt, index) => (
              <div
                key={appt.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  appt.status === "pending"
                    ? "list-group-item-danger"
                    : "list-group-item-success"
                }`}
              >
                <span className="fw-bold"> {index + 1}</span>
                <span>
                  {appt.patientName} ({appt.patientID})
                  {appt.status === "pending" && (
                    <strong> - Not yet seen by the doctor</strong>
                  )}
                </span>
                {appt.status === "pending" && (
                  <button className="btn btn-primary" onClick={() => handleAdmit(appt)}>
                    Admit
                  </button>
                )}              
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorQueue;

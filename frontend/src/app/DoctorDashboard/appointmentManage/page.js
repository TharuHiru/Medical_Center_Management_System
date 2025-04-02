"use client";

import React, { useState, useEffect } from 'react';
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import { admitPatient } from "../../../services/appointmentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorNavBar from '../../../components/doctorSideBar';
import { db } from "../../../lib/firebase"; // Ensure correct Firebase import
import { collection, query,orderBy, onSnapshot } from "../../../lib/firebase"; // Ensure correct Firebase import

function DoctorQueue() {
  const [appointments, setAppointments] = useState([]);

  // ✅ Logout function (Dummy Function)
  const logout = () => {
    toast.info("Logging out...");
    // Add actual logout logic here
  };

  // ✅ Real-time listener for appointments
  useEffect(() => {
    const q = query(collection(db, "appointments"),orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // ✅ Handle "Admit" button click
  const handleAdmit = async (appointment) => {
    try {
      const response = await admitPatient(appointment.id, appointment.appointmentDate);
      if (response.success) {
        toast.success("Patient admitted successfully!");
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

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import { getDoctorAppointments } from "../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
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
  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getDoctorAppointments();
      if (!data) {
        toast.error("Failed to fetch appointments");
        return;
      }
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

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
                <button className="btn btn-primary">Add Prescription</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default DoctorQueue;

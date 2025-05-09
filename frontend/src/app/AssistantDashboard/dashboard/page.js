"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import "../../../Styles/dashboardCard.css";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import AssistNavBar from "../../../components/assistantSideBar";
import { PersonAdd, AccessibilityNew, LocalHospital, EventNote } from "@mui/icons-material";  // Example icons

function AssistantDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
 const { userName } = useAuth();
  // Logout logic
  const logout = () => {
    router.push("/login");
  };

  const totalPatients = 152; // Replace with dynamic data if needed
  const totalDoctors = 25; // Example data for other card
  const totalAppointments = 58; // Example data for other card
  const totalPrescriptions = 95; // Example data for other card

  return (
    <div className="dashboard-container">
      <AssistNavBar onLogout={logout} />
      <div className="content-area container mt-4">
        <div className="welcome-card card custom-float-card shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="image-col">
            <Image
              src="/dashboard.jpg"
              alt="Welcome Illustration"
              width={400}
              height={250}
              className="img-fluid"
              style={{ borderRadius: "1rem" }}
            />
          </div>
          <div className="text-col text-center text-md-start">
            <h1 className="fw-bold mb-2 card-text">Welcome, {userName} 👋</h1>
            <p className="mb-0 text-muted">Wishing you a productive day ahead!</p>
          </div>
        </div>

        {/* Cards Row */}
        <div className="row g-4">
          {/* Card 1 - Total Patients */}
          <div className="col-md-3">
            <div className="card total-doctors-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
              <div style={{ borderLeft: "6px solid green", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Patients</h5>
                  <h2 className="fw-bold text-success">200</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Total Doctors */}
          <div className="col-md-3">
            <div className="card total-doctors-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
              <div style={{ borderLeft: "6px solid blue", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Doctors</h5>
                  <h2 className="fw-bold text-primary">200</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Total Appointments */}
          <div className="col-md-3">
            <div className="card total-appointments-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
              <div style={{ borderLeft: "6px solid #ffc107", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Appointments</h5>
                  <h2 className="fw-bold text-warning">250</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Total Prescriptions */}
          <div className="col-md-3">
            <div className="card total-prescriptions-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
              <div style={{ borderLeft: "6px solid red", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Prescriptions</h5>
                  <h2 className="fw-bold text-danger">300</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AssistantDashboard;

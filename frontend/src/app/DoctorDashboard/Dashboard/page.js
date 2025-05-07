"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import "../../../Styles/dashboardCard.css";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";
import DoctorNavBar from '../../../components/doctorSideBar';

function AssistantDashboard() {
   const router = useRouter();
    //const searchParams = useSearchParams();
    //const firstName = searchParams.get("firstname");
    //const lastName = searchParams.get("lastname");
    const { userName } = useAuth();
    // Function to handle logout
    const logout = () => {
      console.log('Logged out');
      router.push('/login'); // Redirect to login page
    };

  
  return (
    <div className="dashboard-container">
      <DoctorNavBar onLogout={logout} />
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
            <h1 className="fw-bold mb-2 card-text">Welcome,  {userName} 👋</h1>
            <p className="mb-0 text-muted">Wishing you a productive day ahead!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;

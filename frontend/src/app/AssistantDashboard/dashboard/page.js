"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import AssistNavBar from "../../../components/assistantSideBar";
import { FaUser, FaBoxes, FaPlay } from "react-icons/fa";

import AddPatientModal from "../../../components/addPatientModel";

function AssistantDashboard() {
  const router = useRouter();

  const searchParams = useSearchParams(); // get the search parameters from the URL
  const username = `${searchParams.get("firstname")} ${searchParams.get("lastname")}`;

  // Dummy logout function (replace with actual logout logic)
  const logout = () => {
    console.log("Logging out...");
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} />

      <div className="content-area">
        <div className="greeting-container">
          <h5 className="assistant-name">Hello, {username}</h5>
          <p className="greeting-text">Welcome back!</p>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;

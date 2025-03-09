"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaCalendarCheck, FaBoxes, FaUser } from "react-icons/fa";
import "../Styles/sideNavBar.css";

const AssistNavBar = ({ onLogout }) => {
  const pathname = usePathname(); // Get current route

  return (
    <div className="vertical-nav">
      <h4>Dashboard</h4>
      <ul className="nav flex-column dsh-nav-items">
        <li className="nav-item">
          <Link href="/AssistantDashboard/dashboard" 
          className={`nav-link ${pathname === "/AssistantDashboard/dashboard" ? "active" : ""}`}>
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </Link>
        </li>
        <hr></hr>
        <li className="nav-item">
          <Link href="/AssistantDashboard/patientManagement" 
          className={`nav-link ${pathname === "/AssistantDashboard/patientManagement" ? "active" : ""}`}>
            <FaUser className="nav-icon" /> Patients
          </Link>
        </li>
        <hr></hr>
        <li className="nav-item">
          <Link href="/appointments" 
          className={`nav-link ${pathname === "/appointments" ? "active" : ""}`}>
            <FaCalendarCheck className="nav-icon" /> Appointments
          </Link>
        </li>
        <hr></hr>
        <li className="nav-item">
          <Link href="/AssistantDashboard/inventoryManagement" 
          className={`nav-link ${pathname === "/AssistantDashboard/inventoryManagement" ? "active" : ""}`}>
            <FaBoxes className="nav-icon" /> Inventory
          </Link>
        </li>
        <hr></hr>
        <li>
          <button className="btn btn-danger logout-btn" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AssistNavBar;

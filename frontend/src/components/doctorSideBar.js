"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaCalendarCheck, FaUser } from "react-icons/fa";
import "../Styles/sideNavBar.css";

const DoctorNavBar = ({ onLogout }) => {
  const pathname = usePathname(); // Get current route

  return (
    <div className="vertical-nav">
      <h4>Dashboard</h4>
      <ul className="nav flex-column dsh-nav-items">
        <li className="nav-item">
          <Link 
            href="/DoctorDashboard" 
            className={`nav-link ${pathname === "/DoctorDashboard" ? "active" : ""}`}
          >
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </Link>
        </li>
        <hr />
        <li className="nav-item">
          <Link 
            href="/DoctorDashboard/patientManage" 
            className={`nav-link ${pathname === "/DoctorDashboard/patientManage" ? "active" : ""}`}
          >
            <FaUser className="nav-icon" /> Patients
          </Link>
        </li>
        <hr />
        <li className="nav-item">
          <Link 
            href="/DoctorDashboard/appointmentManage" 
            className={`nav-link ${pathname === "/DoctorDashboard/appointmentManage" ? "active" : ""}`}
          >
            <FaCalendarCheck className="nav-icon" /> Appointments
          </Link>
        </li>
        <hr />
        <li className="nav-item">
          <Link 
            href="/DoctorDashboard/assistantManage" 
            className={`nav-link ${pathname === "/DoctorDashboard/assistantManage" ? "active" : ""}`}
          >
            <FaUser className="nav-icon" /> Assistants
          </Link>
        </li>
        <hr />
        <li>
          <button className="btn btn-danger logout-btn" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DoctorNavBar;

// src/components/VerticalNavBar.js
import React from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaCalendarCheck, FaBoxes, FaUser } from "react-icons/fa"; 

const AssistNavBar = ({ onLogout }) => {
  return (
    <div className="vertical-nav">
      <h4>Dashboard</h4>
      <ul className="nav flex-column dsh-nav-items">
        <li className="nav-item">
          <Link href="/" className="nav-link">
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/patients" className="nav-link">
            <FaUser className="nav-icon"/> Patients
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/appointments" className="nav-link">
            <FaCalendarCheck className="nav-icon"/> Appointments
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/inventory" className="nav-link">
            <FaBoxes className="nav-icon"/> Inventory
          </Link>
        </li>
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

"use client"

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import '../../Styles/AssistantDashboard.css';
import '../../Styles/sideNavBar.css';
import '../../Styles/loginForms.css';
import AssistNavBar from '../../components/assistantSideBar';
import { FaUser, FaBoxes, FaPlay } from 'react-icons/fa'; // Import icons

function AssistantDashboard() {
  const router = useRouter();

  // Function to handle logout
  const logout = () => {
    // Logout logic (e.g., clearing tokens)
    console.log('Logged out');
    router.push('/login'); // Use router.push for navigation
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} /> {/* Pass the logout function as a prop */}

      <div className="content-area">
        <div className="greeting-container">
          <h5 className="assistant-name">Hello, Assistant Name</h5>
          <p className="greeting-text">Welcome back!</p>
        </div>

        {/* Three Buttons */}
        <div className="button-container">
        <button className="btn btn-primary btnAddPatient">
        <FaUser size={40} />
            <br />
            Add new Patient
          </button>

          <button className="btn btn-primary btnAddInventory">
            <FaBoxes size={40} />
            <br />
            Add new Inventory
          </button>

          <button className="btn btn-primary btnstartQueue">
            <FaPlay size={40} />
            <br />
            <h5>Start Queue</h5>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;

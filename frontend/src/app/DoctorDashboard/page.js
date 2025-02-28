"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import '../../Styles/AssistantDashboard.css';
import DoctorNavBar from '../../components/assistantSideBar';
import { FaUser, FaBoxes } from 'react-icons/fa'; // Import icons

function DoctorDashboard() {
  const router = useRouter();
  const username = router.query?.username ; // ✅ Optional chaining to prevent errors

  // Function to handle logout
  const logout = () => {
    // Logout logic
    console.log('Logged out');
    router.push('/login'); // Use router.push instead of navigate
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <DoctorNavBar onLogout={logout} /> {/* Pass the logout function as a prop */}

      <div className="content-area">
        <div className="greeting-container">
          <h5 className="assistant-name">Hello, {username}</h5> {/* Default to 'Doctor' if username is not available */}
          <p className="greeting-text">Welcome back!</p>
        </div>

        <div className="button-container">
          <button className="btn btn-primary btnAddPatient">
            <FaUser size={40} />
            <br />
            Add new Assistant
          </button>

          <button className="btn btn-primary btnAddInventory">
            <FaBoxes size={40} />
            <br />
            View Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;

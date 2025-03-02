"use client"

import React from 'react';
import { useSearchParams , useRouter } from "next/navigation";
import '../../Styles/AssistantDashboard.css';
import '../../Styles/sideNavBar.css';
import '../../Styles/loginForms.css';
import AssistNavBar from '../../components/assistantSideBar';
import { FaUser, FaBoxes, FaPlay } from 'react-icons/fa'; // Import icons

function AssistantDashboard() {
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstname");
  const lastName = searchParams.get("lastname");
  const username = `${firstName} ${lastName}`;

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
        <h5 className="assistant-name">Hello, {username}</h5> {/* Default to 'Doctor' if username is not available */}          <p className="greeting-text">Welcome back!</p>
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

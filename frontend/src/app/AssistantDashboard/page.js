"use client"

import React , { useState } from 'react';
import { useSearchParams , useRouter } from "next/navigation";
import '../../Styles/AssistantDashboard.css';
import '../../Styles/loginForms.css';
import AssistNavBar from '../../components/assistantSideBar';
import { FaUser, FaBoxes, FaPlay } from 'react-icons/fa'; 

import AddPatientModal from '../../components/addPatientModel';

function AssistantDashboard() {
  const router = useRouter();
  
  // Function to handle logout
  const logout = () => {
    // Logout logic (e.g., clearing tokens)
    console.log('Logged out');
    router.push('/login'); // Use router.push for navigation
  };

  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstname");
  const lastName = searchParams.get("lastname");
  const username = `${firstName} ${lastName}`;

  const [showPatientModal, setShowPatientModal] = useState(false);    
  const handleShowPatientModal = () => setShowPatientModal(true);
  const handleClosePatientModal = () => setShowPatientModal(false);
  
  //const handleShowInventoryModal = () => setShowInventoryModal(true);
  //const handleCloseInventoryModal = () => setShowInventoryModal(false);

  const handleFormSubmit = () => {
    console.log("Form submitted");
    handleClosePatientModal(); // Close modal after submission
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
        <button className="btn btn-primary btnAddPatient" onClick={handleShowPatientModal}>
        <FaUser size={40} />
            <br />
            Add new Patient
          </button>

          <AddPatientModal 
            showModal={showPatientModal} 
            handleClose={handleClosePatientModal} 
            handleSubmit={handleFormSubmit} />

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

"use client";

import React , { useState } from 'react';
import { useSearchParams , useRouter } from "next/navigation";
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import DoctorNavBar from '../../../components/doctorSideBar';
import { FaUser, FaBoxes } from 'react-icons/fa'; // Import icons

import AddAssistantModal from '../../../components/addAssistantModel';

function DoctorDashboard() {
  //This is used to fetch the first anem and the last name from the URL
  const router = useRouter();

  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstname");
  const lastName = searchParams.get("lastname");
  const username = `${firstName} ${lastName}`;

  // Function to handle logout
  const logout = () => {
    console.log('Logged out');
    router.push('/login'); // Use router.push instead of navigate

  };

    const [showAssistantModal, setShowAssistantModal] = useState(false);    
    const handleShowAssistantModal = () => setShowAssistantModal(true);
    const handleCloseAssistantModal = () => setShowAssistantModal(false);
    
    //const handleShowInventoryModal = () => setShowInventoryModal(true);
    //const handleCloseInventoryModal = () => setShowInventoryModal(false);
    
    const handleFormSubmit = () => {
    console.log("Form submitted");
    handleCloseAssistantModal(); // Close modal after submission
    
  
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
          <button className="btn btn-primary btnAddPatient" onClick={handleShowAssistantModal}>
            <FaUser size={40}  />
            <br />
            Add new Assistant
          </button>

          <AddAssistantModal 
            showModal={showAssistantModal} 
            handleClose={handleCloseAssistantModal} 
            handleSubmit={handleFormSubmit} />

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

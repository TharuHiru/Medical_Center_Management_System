"use client"

import React , { useState } from 'react';
import { useSearchParams , useRouter } from "next/navigation";
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import AssistNavBar from '../../../components/assistantSideBar';
import { FaUser, FaBoxes, FaPlay } from 'react-icons/fa'; 

import AddPatientModal from '../../../components/addPatientModel';
//import ViewAndPrintQr from '../../components/viewAndPrintQr';

function AssistantDashboard() {
  const router = useRouter(); // create a router instance
  
  // Function to handle logout
  const logout = () => {
    // Logout logic (e.g., clearing tokens)
    console.log('Logged out');
    router.push('/login'); // Use router.push for navigation
  };

  //state variable to track if the add patient model is shown or not(default false)
  const [showPatientModal, setShowPatientModal] = useState(false);    
  const handleShowPatientModal = () => setShowPatientModal(true); // show the model
  const handleClosePatientModal = () => setShowPatientModal(false); // close the model

  const handleFormSubmit = () => {
    console.log("Form submitted");
    handleClosePatientModal(); // Close modal after submission
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} /> {/* Pass the logout function as a prop */}

      <div className="content-area">

        {/* Three Buttons */}
        <div className="button-container">
        <button className=" btnAddPatient" onClick={handleShowPatientModal}>
        <FaUser size={40} />
            <br />
            Add new Patient
          </button>

          <AddPatientModal 
            showModal={showPatientModal} 
            handleClose={handleClosePatientModal} 
            handleSubmit={handleFormSubmit} />

          <button className="btnAddInventory">
            <FaBoxes size={40} />
            <br />
            Add new Inventory
          </button>

          <button className="btnstartQueue">
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

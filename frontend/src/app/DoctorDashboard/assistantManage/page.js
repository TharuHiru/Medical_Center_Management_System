"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import "../../../Styles/tableStyle.css";
import { useAuth } from "../../../context/AuthContext";
import DoctorNavBar from '../../../components/doctorSideBar';
import { FaUser } from 'react-icons/fa'; // Import icons
import { fetchAssistants } from '../../../services/doctorAssistantService';
import AddAssistantModal from '../../../components/addAssistantModel';

function DoctorDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstname");
  const lastName = searchParams.get("lastname");
  const { userName } = useAuth();
  // Function to handle logout
  const logout = () => {
    console.log('Logged out');
    router.push('/login'); // Redirect to login page
  };

  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [assistants, setAssistants] = useState([]);

  useEffect(() => {
    // Fetch assistant details when component mounts
    const getAssistants = async () => {
      try {
        const response = await fetchAssistants();
        setAssistants(response.data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };
    getAssistants();
  }, []);

  const handleShowAssistantModal = () => setShowAssistantModal(true);
  const handleCloseAssistantModal = () => setShowAssistantModal(false);

  const handleFormSubmit = async () => {
    console.log("Form submitted");
    handleCloseAssistantModal();
    // Refresh the assistant list after adding a new assistant
    const updatedResponse= await fetchAssistants();
    setAssistants(updatedResponse.data);
  };

  return (
    <div className="dashboard-container">
      <DoctorNavBar onLogout={logout} />
      <div className="content-area">
        <div className="greeting-container">
          <h5 className="assistant-name">Hello, {userName}</h5>
          <p className="greeting-text">Welcome back!</p>
        </div>

        <div className="button-container">
          <button className="btn btn-primary btnAddPatient" onClick={handleShowAssistantModal}>
            <FaUser size={40} />
            <br />
            Add new Assistant
          </button>
          <AddAssistantModal 
            showModal={showAssistantModal} 
            handleClose={handleCloseAssistantModal} 
            handleSubmit={handleFormSubmit} 
          />
        </div>

        <div className="table-wrapper">
          <div className="table-responsive-custom">
            <table className="table table-striped data-table">
              <thead>
                <tr>
                  <th>NIC</th>
                  <th>Title</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Contact Number</th>
                  <th>House No</th>
                  <th>Address Line 1</th>
                  <th>Address Line 2</th>
                </tr>
              </thead>
              <tbody>
                {assistants.length > 0 ? (
                  assistants.map((assistant) => (
                    <tr key={assistant.assist_ID}>
                      <td>{assistant.NIC}</td>
                      <td>{assistant.Title}</td>
                      <td>{assistant.Firs_tName}</td>
                      <td>{assistant.Last_Name}</td>
                      <td>{assistant.Contact_Number}</td>
                      <td>{assistant.House_No}</td>
                      <td>{assistant.Address_Line_1}</td>
                      <td>{assistant.Address_Line_2}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No Assistant record found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import AssistNavBar from "../../../components/assistantSideBar";
import { FaPlus } from "react-icons/fa";
import AddPatientModal from "../../../components/addPatientModel";
import { fetchPatients } from "../../../services/patientService";

function AssistantDashboard() {
  const router = useRouter(); // create a router instance

  // Function to handle logout
  const logout = () => {
    console.log("Logged out");
    router.push("/login"); // Use router.push for navigation
  };

  // State variable to track if the add patient modal is shown or not
  const [showPatientModal, setShowPatientModal] = useState(false);
  const handleShowPatientModal = () => setShowPatientModal(true);
  const handleClosePatientModal = () => setShowPatientModal(false);

  const handleFormSubmit = () => {
    console.log("Form submitted");
    handleClosePatientModal(); // Close modal after submission
  };

  // State to store patient data
  const [patients, setPatients] = useState([]);

  // Fetch patients from the service
  useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data.data); // Ensure you are setting the correct data structure
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    getPatients();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} />

      <div className="content-area">
        {/* Add Patient Button */}
        <div className="button-container">
          <button className="btnAddPatient ms-auto" onClick={handleShowPatientModal}>
            <FaPlus size={40} />
            &nbsp; Add New Patient
          </button>

          {/* Modal Component */}
          <AddPatientModal
            showModal={showPatientModal}
            handleClose={handleClosePatientModal}
            handleSubmit={handleFormSubmit}
          />
        </div>

        {/* Patient Table */}
        <div className="patient-table-container">
          <h2>&nbsp; &nbsp; Patient Details</h2>
          <table className="table table-striped data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>House No</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.patient_ID}>
                    <td>{patient.patient_ID}</td>
                    <td>{patient.title}</td>
                    <td>{patient.firstName}</td>
                    <td>{patient.lastName}</td>
                    <td>{patient.contactNo}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.DOB}</td>
                    <td>{patient.house_no}</td>
                    <td>{patient.addr_line_1}</td>
                    <td>{patient.addr_line_2}</td>
                    <td>{patient.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import AssistNavBar from "@/components/assistantSideBar";
import { FaPlus, FaSearch, FaPencilAlt, FaTimes, FaCheck } from "react-icons/fa";
import AddPatientModal from "@/components/addPatientModel";
import { fetchPatients, updatePatient } from "@/services/patientService";
import "@/Styles/tableStyle.css";
import { toast } from "react-toastify";

function AssistantDashboardPatient() {
  const router = useRouter();

  // Function to handle logout
  const logout = () => {
    console.log("Logged out");
    router.push("/login");
  };

  // State for Add Patient Modal
  const [showPatientModal, setShowPatientModal] = useState(false);
  const handleShowPatientModal = () => setShowPatientModal(true);
  const handleClosePatientModal = () => setShowPatientModal(false);
  const handleFormSubmit = () => {
    console.log("Form submitted");
    handleClosePatientModal();
  };

  // State to store patient data
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch patients from the service
  useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data.data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };
    getPatients();
  }, []);

  // Filter patients based on search input
  const filteredPatients = patients.filter((patient) => {
    return Object.values(patient).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle edit click
  const handleEditClick = (patient) => { setEditingId(patient.patient_ID);
    setEditFormData({
      title: patient.title,
      firstName: patient.firstName,
      lastName: patient.lastName,
      contactNo: patient.contactNo,
      gender: patient.gender,
      DOB: patient.DOB,
      house_no: patient.house_no,
      addr_line_1: patient.addr_line_1,
      addr_line_2: patient.addr_line_2,
      email: patient.email
    });
  };

  // Handle cancel edit
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Handle form field changes
  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle form edit submission
  const handleEditFormSubmit = async (patientId) => {
  try {
      // Validate required fields
    const requiredFields = {
      'First Name': editFormData.firstName,
      'Last Name': editFormData.lastName,
      'Contact Number': editFormData.contactNo,
      'Gender': editFormData.gender,
      'Date of Birth': editFormData.DOB,
      'House Number': editFormData.house_no,
      'Address Line 1': editFormData.addr_line_1,
      'Email': editFormData.email
    };
    for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || !value.toString().trim()) {
          toast.error(`${field} is required`);
          return;
        }
    }

    // Validate name fields (English letters, spaces, hyphens, apostrophes)
    if (!/^[A-Za-z\s'-]+$/.test(editFormData.firstName)) {
      toast.error('Invalid characters in first name');
      return;
    }

    if (!/^[A-Za-z\s'-]+$/.test(editFormData.lastName)) {
      toast.error('Invalid characters in last name');
      return;
    }

    // Validate phone number (10 digits starting with 0)
    if (!/^0\d{9}$/.test(editFormData.contactNo)) {
      toast.error('Contact must be 10 digits starting with 0');
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate date is in the past
    if (new Date(editFormData.DOB) >= new Date()) {
      toast.error('Date of birth must be in the past');
      return;
    }
     // call the update backend 
      const data = await updatePatient(patientId, editFormData);
      if (data.success) {
        toast.success("Patient updated successfully");  
        const updatedPatients = patients.map(patient => {
          if (patient.patient_ID === patientId) {
            return { ...patient, ...editFormData };
          }
          return patient;
        });      
        setPatients(updatedPatients);
        setEditingId(null);
    }
    } catch (error) {
      console.error("Failed to update patient:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <AssistNavBar onLogout={logout} />
      <div className="content-area container mt-4">
      
        {/* Add Patient Button */}
        <div className="button-container">
          <button className="btnAddPatient ms-auto" onClick={handleShowPatientModal}>
            <FaPlus size={40} /> &nbsp; Add New Patient
          </button>

          {/* Modal Component */}
          <AddPatientModal
            showModal={showPatientModal}
            handleClose={handleClosePatientModal}
            handleSubmit={handleFormSubmit}
          />
        </div>

        {/* Search Box */}
        <h1>&nbsp; Patient Details</h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search patients..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Patient Table */}
        <div>
          <div className="table-wrapper">
            <div className="table-responsive-custom">
              <table className="data-table">
              <thead>
                <tr>
                  <th className="action-col">Actions</th>
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
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.patient_ID}>
                      <td className="action-col">
                        {editingId === patient.patient_ID ? (
                          <>
                            <button className="btn btn-success btn-sm me-1" onClick={() => handleEditFormSubmit(patient.patient_ID)}>
                              save
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={handleCancelClick}>
                              cancel
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-sm" onClick={() => handleEditClick(patient)}>
                            <FaPencilAlt></FaPencilAlt>
                          </button>
                        )}
                      </td>
                      <td>{patient.patient_ID}</td>
                      {editingId === patient.patient_ID ? (
                        <>
                          <td>
                            <select
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditFormChange}
                              className="form-control"
                            >
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                              <option value="Rev">Rev</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              name="firstName"
                              value={editFormData.firstName}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="lastName"
                              value={editFormData.lastName}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="contactNo"
                              value={editFormData.contactNo}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <select
                              name="gender"
                              value={editFormData.gender}
                              onChange={handleEditFormChange}
                              className="form-control"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              name="DOB"
                              value={editFormData.DOB}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="house_no"
                              value={editFormData.house_no}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="addr_line_1"
                              value={editFormData.addr_line_1}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="addr_line_2"
                              value={editFormData.addr_line_2}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12">No patients found</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AssistantDashboardPatient;
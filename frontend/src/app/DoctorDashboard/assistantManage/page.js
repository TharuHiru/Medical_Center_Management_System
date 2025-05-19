"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import '@/Styles/AssistantDashboard.css';
import '@/Styles/loginForms.css';
import "@/Styles/tableStyle.css";
import { useAuth } from "@/context/AuthContext";
import DoctorNavBar from '@/components/doctorSideBar';
import { toast } from "react-toastify"; // Import Toastify for toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { FaUser , FaPencilAlt } from 'react-icons/fa'; // Import icons
import { fetchAssistants , updateAssistant } from '@/services/doctorAssistantService';
import AddAssistantModal from '@/components/addAssistantModel';
import ProtectedRoute from '@/components/protectedRoute';

function DoctorDashboard() {
  const router = useRouter();
  const { userName } = useAuth();

  // Function to handle logout
  const logout = () => {
    console.log('Logged out');
    router.push('/login'); // Redirect to login page
  };

  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [assistants, setAssistants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssistant, setEditingAssistant] = useState(null);

  // search function of the assistant
  const filteredAssistants = assistants.filter((assistant) =>
  Object.values(assistant).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
);

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

  // Add new assistant form submit logic
  const handleFormSubmit = async () => {
    console.log("Form submitted");
    handleCloseAssistantModal();  // Refresh the assistant list after adding a new assistant
    const updatedResponse= await fetchAssistants();
    setAssistants(updatedResponse.data);
  };

  // cancel button when click on edit
  const cancelEdit = () => {
  setEditingAssistant(null);
};

  // Update assistant call
  const handleSaveAssistant = async (id) => {
     if (!validateAssistant(editingAssistant)) {
  return;
}
    try {
      const result = await updateAssistant(id, editingAssistant); // Send updated data to backend
      if (result.success) {
        toast.success("Assistant updated successfully");
        const updatedResponse = await fetchAssistants(); // Refresh the list
        setAssistants(updatedResponse.data);
        setEditingAssistant(null);
      }
    } catch (error) {
      console.error("Failed to save assistant:", error);
    }
  };

  const validateAssistant = (assistant) => {
  const { First_Name, Last_Name, Email, Contact_Number, NIC } = assistant;

  if (!String(First_Name).trim() || !String(Last_Name).trim() || !String(Email).trim() || !String(Contact_Number).trim()) {
    toast.error('Please fill all required fields');
    return false;
  }

  const nameRegex = /^[A-Za-z]+$/;
  if (!nameRegex.test(First_Name) || !nameRegex.test(Last_Name)) {
    toast.error('Names should contain only letters');
    return false;
  }

  const contactRegex = /^0\d{9}$/;
  if (!contactRegex.test(Contact_Number)) {
    toast.error('Invalid contact number');
    return false;
  }

  return true;
};

  return (
    <ProtectedRoute>
    <div className="dashboard-container">
      <DoctorNavBar onLogout={logout} />
        <div className="content-area container mt-4">
        <h1> &nbsp; Assistants Details</h1>
        <div className="button-container text-end mb-3">
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

        {/*Search container*/}
        <div className="search-container mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search assistants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <div className="table-responsive-custom">
            <table className="table table-striped data-table">
              <thead>
                <tr>
                  <th></th>
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
                {filteredAssistants.length > 0 ? (
                  filteredAssistants.map((assistant) => (
                    <tr key={assistant.assist_ID}>
                      <td> {editingAssistant?.assist_ID === assistant.assist_ID ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-1" onClick={() => handleSaveAssistant(assistant.assist_ID)}
                            > Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary" onClick={cancelEdit}
                            > Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-sm " onClick={() => setEditingAssistant({ ...assistant })}
                          > <FaPencilAlt className="me-1" />
                          </button>
                        )}
                      </td>

                      {/* Inline Editable Fields */}
                      {['NIC', 'Title', 'First_Name', 'Last_Name', 'Contact_Number', 'House_No', 'Address_Line_1', 'Address_Line_2'].map((field) => (
                        <td key={field}>
                          {editingAssistant?.assist_ID === assistant.assist_ID ? (
                            field === 'NIC' ? (
                              editingAssistant[field] // NIC is uneditable
                            ) : (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editingAssistant[field] || ""}
                                onChange={(e) =>
                                  setEditingAssistant({
                                    ...editingAssistant,
                                    [field]: e.target.value,
                                  })
                                }
                              />
                            )
                          ) : (
                            assistant[field]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No matching assistants found</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

export default DoctorDashboard;
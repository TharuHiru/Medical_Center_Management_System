"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import '@/Styles/AssistantDashboard.css';
import '@/Styles/loginForms.css';
import "@/Styles/tableStyle.css";
import { useAuth } from "@/context/AuthContext";
import DoctorNavBar from '@/components/doctorSideBar';
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaPencilAlt, FaUserSlash } from 'react-icons/fa';
import { fetchAssistants, updateAssistant, deactivateAssistant } from '@/services/doctorAssistantService';
import AddAssistantModal from '@/components/addAssistantModel';
import ProtectedRoute from '@/components/protectedRoute';

function DoctorDashboard() {
  const router = useRouter();
  const { userName } = useAuth();

  const logout = () => {
    console.log('Logged out');
    router.push('/login');
  };

  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [assistants, setAssistants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssistant, setEditingAssistant] = useState(null);

  const filteredAssistants = assistants.filter((assistant) =>
    Object.values(assistant).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
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
    const updatedResponse = await fetchAssistants();
    setAssistants(updatedResponse.data);
  };

  const cancelEdit = () => {
    setEditingAssistant(null);
  };

  const handleDeactivateAssistant = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, deactivate it!'
  });

  if (result.isConfirmed) {
    try {
      const response = await deactivateAssistant(id);
      if (response.success) {
        await Swal.fire(
          'Deactivated!',
          'The assistant has been deactivated.',
          'success'
        );
        const updatedResponse = await fetchAssistants();
        setAssistants(updatedResponse.data);
      }
    } catch (error) {
      console.error("Failed to deactivate assistant:", error);
      Swal.fire(
        'Error!',
        'Failed to deactivate assistant.',
        'error'
      );
    }
  }
};

  const handleSaveAssistant = async (id) => {
    if (!validateAssistant(editingAssistant)) {
      return;
    }
    try {
      const result = await updateAssistant(id, editingAssistant);
      if (result.success) {
        toast.success("Assistant updated successfully");
        const updatedResponse = await fetchAssistants();
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

          <div className="search-container mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <div className="table-responsive-custom">
              <table className="table table-striped data-table">
                <thead>
                  <tr>
                    <th>Edit</th>
                    <th>Action</th>
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
                        <td>
                          {editingAssistant?.assist_ID === assistant.assist_ID ? (
                            <>
                              <button
                                className="btn btn-sm btn-success me-1"
                                onClick={() => handleSaveAssistant(assistant.assist_ID)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-sm"
                              onClick={() => setEditingAssistant({ ...assistant })}
                              title="Edit Assistant"
                            >
                              <FaPencilAlt />
                            </button>
                          )}
                        </td>
                        <td>
                          {assistant.Active === 1 && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeactivateAssistant(assistant.assist_ID)}
                              title="Deactivate Assistant"
                            >
                              <FaUserSlash />
                            </button>
                          )}
                        </td>
                        <td>
                          {assistant.NIC}
                          {assistant.Active === 0 && <span style={{ color: 'red' }}> (Deactivated)</span>}
                        </td>
                        {['Title', 'First_Name', 'Last_Name', 'Contact_Number', 'House_No', 'Address_Line_1', 'Address_Line_2'].map((field) => (
                          <td key={field}>
                            {editingAssistant?.assist_ID === assistant.assist_ID ? (
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
                            ) : (
                              assistant[field]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">No matching assistants found</td>
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
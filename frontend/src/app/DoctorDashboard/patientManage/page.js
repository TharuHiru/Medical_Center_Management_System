"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import AssistNavBar from "../../../components/assistantSideBar";
import { FaEye, FaSearch } from "react-icons/fa";
import { fetchPatients } from "../../../services/patientService";

function AssistantDashboardPatient() {
  const router = useRouter();

  // Function to handle logout
  const logout = () => {
    console.log("Logged out");
    router.push("/login"); 
  };

  // State to store patient data
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedPatient, setSelectedPatient] = useState(null); 

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

  // Handle clicking the eye icon to show patient details
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient); 
  };

  // Handle editing the patient details
  const handleEditPatient = (e) => {
    e.preventDefault();
    // Implement the edit functionality, e.g., send updated data to the server
    console.log("Patient updated:", selectedPatient);
  };

  return (
    <div className="dashboard-container">
      <AssistNavBar onLogout={logout} />

      <div className="content-area">
        {/* Search Box */}
        <br />
        <h2>&nbsp; &nbsp; Patient Details</h2>
        <br />
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
        <div className="patient-table-container">
          <div className="table-responsive-custom">
            <table className="table table-striped patient-data-table">
              <thead>
                <tr>
                  <th></th>
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
                      <td>
                        <FaEye
                          onClick={() => handleViewPatient(patient)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
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

        {/* Patient Details on the Right Side */}
        {selectedPatient && (
          <div className="patient-details-container">
            <h3>Patient Details</h3>
            <form onSubmit={handleEditPatient}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={selectedPatient.title}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={selectedPatient.firstName}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={selectedPatient.lastName}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Contact:</label>
                <input
                  type="text"
                  value={selectedPatient.contactNo}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      contactNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={selectedPatient.email}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssistantDashboardPatient;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorNavBar from "../../../components/doctorSideBar";
import { FaEye, FaSearch } from "react-icons/fa";
import { fetchPatients } from "../../../services/patientService";
import PatientProfileView from "../../../components/patientProfile";

function AssistantDashboardPatient() {
  const router = useRouter();

  const logout = () => {
    console.log("Logged out");
    router.push("/login");
  };

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patientDetailsRef = useRef(null);  // Ref to scroll to patient details

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

  const filteredPatients = patients.filter((patient) => {
    return Object.values(patient).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);

    // Scroll to the patient details section
    patientDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dashboard-container">
      <DoctorNavBar onLogout={logout} />

      <div className="content-area">
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
                    <td colSpan="12">No patients found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedPatient && (
          <div className="container" ref={patientDetailsRef}>
            <div className="row justify-content-center">
              <div className="col-md-10 mt-5" style={{ maxWidth: '80%' }}>
                <PatientProfileView patient={selectedPatient} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssistantDashboardPatient;

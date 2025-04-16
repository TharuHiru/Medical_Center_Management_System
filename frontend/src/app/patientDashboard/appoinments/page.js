"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {collection,query,orderBy,onSnapshot,deleteDoc,doc,} from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { createAppointment } from "../../../services/appointmentService";
import { fetchPatientIDs } from "../../../services/patientAuthService";
import { useAuth } from "../../../context/AuthContext";

import PatientSidebar  from "../../../components/patientSideBar"; 

export default function AppointmentQueue() {
  const { userType, patientID ,masterID} = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientQueueNumber, setPatientQueueNumber] = useState(null);
  const [nextPosition, setNextPosition] = useState(1);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState('');

  //Get patient names to view in the Queue
  const getPatientName = (id) => {
  const patient = patientList.find((p) => p.patient_ID === id);
  return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
};

//Load the patients IDs using the master ID
  useEffect(() => {
    const loadPatients = async () => {
      if (!masterID) {
        console.warn("masterID not ready, skipping fetch");
        return;
      }
  
      try {
        const data = await fetchPatientIDs(masterID);
        setPatientList(data);
        if (data.length > 0) {
          setSelectedPatientID(data[0].patient_ID);
        }
      } catch (err) {
        console.error("Failed to load patient IDs", err);
        toast.error("Failed to load patient IDs");
      }
    };
  
    loadPatients();
  }, [masterID]);

  //Get all the patient ID s for that particular account as a list
  const patientIDsOwnedByUser = patientList.map(p => p.patient_ID);

  //Get the queue number of the selected patient
  useEffect(() => {
    const selectedPatientAppt = appointments.find(
      (appt) => appt.patient_ID === selectedPatientID && appt.status === "pending"
    );
    setPatientQueueNumber(selectedPatientAppt ? selectedPatientAppt.queueNumber : null);
  }, [appointments, selectedPatientID]);

  //Real-time listener for appointments
  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        queueNumber: index + 1,
        ...doc.data(),
      }));
      setAppointments(data);
      setNextPosition(data.length + 1);

      const patientAppointment = data.find((appt) => appt.id === patientID);
      if (patientAppointment && patientAppointment.status === "pending") {
        setPatientQueueNumber(patientAppointment.queueNumber);
      } else {
        setPatientQueueNumber(null);
      }
    });
    return () => unsubscribe();
  }, [patientID]);

  //Deleting an appointment
  const handleRemove = async (appointmentID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove your appointment permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "appointments", appointmentID));
          toast.success("Appointment removed successfully!");
        } catch (error) {
          Swal.fire("Error", "Failed to remove appointment.", "error");
          toast.error("Failed to remove appointment.");
        }
      }
    });
  };

  //Handling booking an appintment
  const handleBook = async () => {
    if (!selectedPatientID) {
      toast.error("Please select a patient");
      return;
    }
  
    try {
      await createAppointment(selectedPatientID, new Date().toISOString().split("T")[0]);
      toast.success("Appointment booked successfully!");
    } catch (errorMessage) {
      toast.error(errorMessage);
    }
  };

  //Handle logout function
  const logout = () => {
    console.log("Logged out");
  };

  return (
    <>
      <PatientSidebar  onLogout={logout} />
      <div className="content-area" style={{ marginLeft: '260px' }}>
      <div className="container mt-4">
        <h2 className="text-center">Today&apos;s Appointment Queue</h2>
        <hr></hr>
        <br></br>

        <div className="row">
          <div className="col-md-8">
            <div className="list-group">
              {appointments.map((appt, index) => {
                  const isUserAppointment = patientIDsOwnedByUser.includes(appt.id); // check if belongs to current user
                  return (
                    <div
                      key={appt.id}
                      className={`list-group-item d-flex justify-content-between align-items-center 
                        ${
                          isUserAppointment
                            ? "list-group-item-primary"
                            : appt.status === "in progress"
                            ? "list-group-item-warning"
                            : appt.status === "pending"
                            ? "list-group-item-danger"
                            : "list-group-item-success"
                        }`}
                    >
                      <span className="fw-bold">{index + 1}</span>
                      <span> <small>{getPatientName(appt.id)}</small></span>
                      <span>
                        {appt.status === "pending" ? (
                          <strong>Not yet seen by the doctor</strong>
                        ) : appt.status === "in progress" ? (
                          <strong>In Progress</strong>
                        ) : (
                          <strong>Seen by the doctor</strong>
                        )}
                      </span>
                      {isUserAppointment && appt.status === "pending" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(appt.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Book the Next Available Position</h5>
              <p>
                Next Available: <strong>Position {nextPosition}</strong>
              </p>
              <select
                  className="form-select mb-3"
                  value={selectedPatientID}
                  onChange={(e) => setSelectedPatientID(e.target.value)}
                >
                  {patientList.map((patient) => (
                    <option key={patient.patient_ID} value={patient.patient_ID}>
                      {patient.firstName} {patient.lastName} (ID: {patient.patient_ID})
                    </option>
                  ))}
                </select>

              <button className="btn btn-primary w-100" onClick={handleBook}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
        </div>
      </div>
    </>
  );
}

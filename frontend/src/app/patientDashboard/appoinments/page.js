"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { createAppointment } from "../../../services/appointmentService";
import { fetchPatientIDs } from "../../../services/patientAuthService";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar from "../../../components/patientSideBar";

export default function AppointmentQueue() {
  const { userType, patientID, masterID } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientQueueNumber, setPatientQueueNumber] = useState(null);
  const [nextPosition, setNextPosition] = useState(1);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState("");
  const [doctorAvailable, setDoctorAvailable] = useState(false);
  const [todayUnavailableNote, setTodayUnavailableNote] = useState(null);

  // Get patient names to view in the Queue
  const getPatientName = (id) => {
    const patient = patientList.find((p) => p.patient_ID === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  // Fetch list of patients under this master user
  useEffect(() => {
    const loadPatients = async () => {
      if (!masterID) return;
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

  // Fetch doctor's availability for today and upcoming
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      const today = new Date().toISOString().split("T")[0];
      const querySnapshot = await getDocs(collection(db, "doctorAvailability"));
      let todayNote = null;

      querySnapshot.forEach((docSnap) => {
        const date = docSnap.id;
        const { available, note } = docSnap.data();

        if (date === today) {
          if (!available) {
            todayNote = note || "Doctor is not available today.";
          }
        }
      });

      setTodayUnavailableNote(todayNote);
    };

    fetchUnavailableDates();
  }, []);

  // Listen to real-time doctor availability for today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const queueStatusRef = doc(db, "queueStatus", today);
    let unsubscribeDoctor = null;
  
    const unsubscribeQueue = onSnapshot(queueStatusRef, (queueDoc) => {
      if (queueDoc.exists()) {
        const { started } = queueDoc.data();
  
        if (started === true) {
          // Queue started — allow booking
          setDoctorAvailable(true);
          setTodayUnavailableNote(null);
  
          // Clean up doctor availability listener if active
          if (unsubscribeDoctor) {
            unsubscribeDoctor();
            unsubscribeDoctor = null;
          }
        } else {
          // Queue not started — check doctor availability
          const doctorRef = doc(db, "doctorAvailability", today);
  
          unsubscribeDoctor = onSnapshot(doctorRef, (docSnap) => {
            if (docSnap.exists()) {
              const { note } = docSnap.data();
              setDoctorAvailable(false);
              setTodayUnavailableNote(note || "Doctor is not available today.");
            } else {
              setDoctorAvailable(false);
              setTodayUnavailableNote("The queue is not active");
            }
          });
        }
      } else {
        // No queueStatus document
        setDoctorAvailable(false);
        setTodayUnavailableNote("The queue will be started soon. Please wait.");
      }
    });
  
    // Clean up both listeners on unmount
    return () => {
      unsubscribeQueue();
      if (unsubscribeDoctor) unsubscribeDoctor();
    };
  }, []);
  

  // Real-time appointment queue
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

      const patientAppointment = data.find(
        (appt) => appt.id === patientID && appt.status === "pending"
      );
      setPatientQueueNumber(patientAppointment ? patientAppointment.queueNumber : null);
    });

    return () => unsubscribe();
  }, [patientID]);

  // Get current user's patient IDs
  const patientIDsOwnedByUser = patientList.map((p) => p.patient_ID);

  // Determine if selected patient is in queue
  useEffect(() => {
    const selectedPatientAppt = appointments.find(
      (appt) => appt.patient_ID === selectedPatientID && appt.status === "pending"
    );
    setPatientQueueNumber(selectedPatientAppt ? selectedPatientAppt.queueNumber : null);
  }, [appointments, selectedPatientID]);

  // Book appointment
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

  // Remove appointment
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

  const logout = () => {
    console.log("Logged out");
  };

  return (
    <>
      <PatientSidebar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>
        {todayUnavailableNote && (
          <div className="alert alert-danger mt-3">
            <strong>Doctor Notice:</strong> {todayUnavailableNote}
          </div>
        )}

        <div className="container mt-4">
          <h2 className="text-center">Today&apos;s Appointment Queue</h2>
          <hr />
          <div className="row">
            <div className="col-md-8">
              <div className="list-group">
                {appointments.map((appt, index) => {
                  const isUserAppointment = patientIDsOwnedByUser.includes(appt.id);
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
                      <span>
                        <small>{getPatientName(appt.id)}</small>
                      </span>
                      <span>
                        {appt.status === "pending" ? (
                          <strong>Not yet seen</strong>
                        ) : appt.status === "in progress" ? (
                          <strong>In Progress</strong>
                        ) : (
                          <strong>Seen</strong>
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
                <button
                  className="btn btn-primary w-100"
                  onClick={handleBook}
                  disabled={!doctorAvailable || patientQueueNumber !== null}
                >
                  {
                    !doctorAvailable
                      ? "Doctor Unavailable"
                      : patientQueueNumber !== null
                      ? "Already in Queue"
                      : "Book Appointment"
                  }
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

"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection,query,orderBy,onSnapshot,deleteDoc,doc,where,getDocs} from "firebase/firestore";

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
  const [todayUnavailableNote, setTodayUnavailableNote] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getFormattedDate = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

  // Get patient names to view in the Queue
  const getPatientName = (id) => {
    const patient = patientList.find((p) => p.patient_ID === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  // Fetch list of patients under this master user from the SQL database
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


  // Real-time appointment queue for selected date
  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "asc"),
      where("appointmentDate", "==", getFormattedDate(selectedDate)) // Filter by the selected date
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          docId: doc.id, // because the document has id column, i use docID to avoid confusion
          ...doc.data(),
        }))
        .map((doc, index) => ({
          ...doc,
          queueNumber: index + 1,
        }));
      setAppointments(data); //get appointments for the day
      setNextPosition(data.length + 1); // next position in the queue

      const patientAppointment = data.find(
        (appt) => appt.id.endsWith(`_${patientID}`) && appt.status === "pending"
      );
      setPatientQueueNumber(patientAppointment ? patientAppointment.queueNumber : null);
    });
    return () => unsubscribe();
  }, [patientID, selectedDate]);

  // Get current user's patient IDs
  const patientIDsOwnedByUser = patientList.map((p) => p.patient_ID);

  // Determine if selected patient is in queue
  useEffect(() => {
    const selectedPatientAppt = appointments.find(
      (appt) => appt.id === selectedPatientID && appt.status === "pending" //the id column has the patient ID and pending means doctor has not seen the patient yet
    );
    setPatientQueueNumber(selectedPatientAppt ? selectedPatientAppt.queueNumber : null);
  }, [appointments, selectedPatientID]);


  // Book appointment
  const handleBook = async () => {
    if (!selectedPatientID) {
      toast.error("Please select a patient");
      return; }
    const formattedDate = getFormattedDate(selectedDate);
    try {
      await createAppointment(selectedPatientID, formattedDate); //call the service to create appointment
      toast.success("Appointment booked successfully!");
    } catch (error) {
      if (error.message.includes("already exists")) 
      {
        toast.error("You already have an appointment on this day!"); // dont allow same patient to book on the same day
      } else {
        console.error("Booking error:", error);
        toast.error("Failed to book appointment.");
      }
    }
  };

  // Remove appointment
  const handleRemove = async (appointmentID) => {
    //pretty delete button
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
          await deleteDoc(doc(db, "appointments", appointmentID)); // call firebase to delete the appointment
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

  // Handle date selection for tabs
  const handleDateTabClick = (dateOffset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + dateOffset);
    setSelectedDate(newDate);
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
        <div className ="container mt-4">
          <h2 className="text-center"> Appointment Queue </h2>
          <h4 className="text-center">{getFormattedDate(selectedDate)}</h4> {/* Display the date*/}
          <hr />
          {/* Display the queue Tabs */}
          <div className="mb-4 text-center">
            <div className="btn-group" role="group">
              {["Today", "Tomorrow", "Day After Tomorrow"].map((label, index) => {
                return (
                  <button
                    key={label}
                    type="button"
                    className={`btn btn-outline-primary ${
                      getFormattedDate(selectedDate) === getFormattedDate(new Date(new Date().setDate(new Date().getDate() + index))) ? "active" : ""
                    }`}
                    onClick={() => handleDateTabClick(index)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2">Viewing appointments and booking for: <strong>{getFormattedDate(selectedDate)}</strong></p>
          </div>

          {/* Display the queue */}
          <div className="row">
            <div className="col-md-8">
              <div className="list-group">
                {appointments.map((appt, index) => {
                  const isUserAppointment = patientIDsOwnedByUser.some((pid) =>appt.docId.endsWith(`_${pid}`)); //check if the appointment belongs to the current user                 
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
                        <span className="fw-bold">{appt.id}</span>
                      {isUserAppointment && appt.status === "pending" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(appt.docId) // send the document ID to delete the appointment
                          }
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking section */}
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
                >
                  Book the Number
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

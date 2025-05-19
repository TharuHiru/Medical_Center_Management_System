"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, where, getDocs 
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createAppointment } from "@/services/appointmentService";
import { fetchPatientIDs } from "@/services/patientAuthService";
import { useAuth } from "@/context/AuthContext";
import PatientSidebar from "@/components/patientSideBar";
import { FaCalendarAlt, FaUserClock, FaUserCheck, FaUserMinus, FaSpinner, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import ProtectedRoute from '@/components/protectedRoute';

export default function AppointmentQueue() {
  const { userType, patientID, masterID } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientQueueNumber, setPatientQueueNumber] = useState(null);
  const [nextPosition, setNextPosition] = useState(1);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState("");
  const [todayUnavailableNote, setTodayUnavailableNote] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [queueStatus, setQueueStatus] = useState(null);
  const [queueNote, setQueueNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Format date as yyyy-mm-dd
  const getFormattedDate = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

  // Format date for display (e.g., Monday, May 8)
  const getDisplayDate = (date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Get patient names to view in the Queue
  const getPatientName = (id) => {
    const patient = patientList.find((p) => p.patient_ID === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  // Fetch list of patients under this master user from the SQL database
  useEffect(() => {
    const loadPatients = async () => {
      if (!masterID) return;
      setIsLoading(true); //add loading animation in the button
      try {
        const data = await fetchPatientIDs(masterID);
        setPatientList(data);
        if (data.length > 0) {
          setSelectedPatientID(data[0].patient_ID);
        }
      } catch (err) {
        console.error("Failed to load patient IDs", err);
        toast.error("Failed to load patient IDs");
      } finally {
        setIsLoading(false);
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
      return;
    }
    const formattedDate = getFormattedDate(selectedDate);
    setIsLoading(true);
    
    try {
      await createAppointment(selectedPatientID, formattedDate); //call the service to create appointment
      toast.success("Appointment booked successfully!");
    } catch (error) {
      if (error.message.includes("already exists")) {
        toast.error("You already have an appointment on this day!"); // dont allow same patient to book on the same day
      } else {
        console.error("Booking error:", error);
        toast.error("Failed to book appointment.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove appointment
  const handleRemove = async (appointmentID) => {
    //pretty delete button
    Swal.fire({
      title: "Are you sure?",text: "This will remove your appointment permanently!",icon: "warning",
      showCancelButton: true,confirmButtonColor: "#d33",cancelButtonColor: "#3085d6",confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await deleteDoc(doc(db, "appointments", appointmentID)); // call firebase to delete the appointment
          toast.success("Appointment removed successfully!");
        } catch (error) {
          Swal.fire("Error", "Failed to remove appointment.", "error");
          toast.error("Failed to remove appointment.");
        } finally {
          setIsLoading(false);
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

  // Check if the doctor is unavailable today
  useEffect(() => {
    const fetchQueueStatus = async () => {
      setIsLoading(true);
      try {
        const statusDocs = await getDocs(query(collection(db, "queueStatus"), where("date", "==", getFormattedDate(selectedDate)))); // Get the docof the day
  
        if (!statusDocs.empty) {
          const data = statusDocs.docs[0].data(); // Get the first document's data
          setQueueStatus(data.status); // 'started', 'stopped', etc.
          setQueueNote(data.note || "");
        } else {
          setQueueStatus("started"); // Default to started if no record exists
          setQueueNote("");
        }
      } catch (err) {
        console.error("Error fetching queue status:", err);
        toast.error("Could not load queue status");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchQueueStatus();
  }, [selectedDate]);

  // check if the selected patient already has an appointment
  const hasAppointment = appointments.some(
    appt => appt.id === selectedPatientID && appt.status === "pending"
  );

  return (
    <ProtectedRoute>
    <div className="bg-light min-vh-100">
      <PatientSidebar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>
        <div className="container py-4">
          <div className="card shadow-sm">
            <div className="card-header text-white py-3" style={{ background: 'rgba(32, 58, 67, 0.9)' }}>
              <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0" >
                <FaCalendarAlt className="me-2" /> Appointment Queue
              </h2>
                <span className="badge bg-white text-primary fs-6">
                  {getDisplayDate(selectedDate)}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              {/* Date navigation tabs */}
              <div className="mb-4 text-center">
                <div className="btn-group" role="group" style={{ background: 'rgba(32, 58, 67, 0.9)' }}>
                  {[{ label: "Today", offset: 0 },{ label: "Tomorrow", offset: 1 },{ label: "Day After Tomorrow", offset: 2 }
                  ].map((item) => {
                    const isSelected =getFormattedDate(selectedDate) ===getFormattedDate(new Date(new Date().setDate(new Date().getDate() + item.offset)));
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="btn"
                        style={{
                          background: isSelected ? 'rgba(32, 58, 67, 0.9)' : 'white', color: isSelected ? 'white' : 'rgba(32, 58, 67, 0.9)',
                          borderColor: 'rgba(32, 58, 67, 0.9)'
                        }}
                        onClick={() => handleDateTabClick(item.offset)}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Queue Status Notifications */}
              {queueStatus === "stopped" && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <div>
                    <strong>Queue Stopped:</strong> {queueNote || "The doctor is currently unavailable. Booking is disabled."}
                  </div>
                </div>
              )}
              {queueStatus === "started" && queueNote && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <FaInfoCircle className="me-2" />
                  <div>
                    <strong>Doctor Notice:</strong> {queueNote}
                  </div>
                </div>
              )}
              {todayUnavailableNote && (
                <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <div>
                    <strong>Notice:</strong> {todayUnavailableNote}
                  </div>
                </div>
              )}

              {/* Your Position Indicator (if applicable) */}
              {patientQueueNumber && (
                <div className="text-center mb-4">
                  <div className="card border-primary">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-0">Your Current Position</h5>
                      <div className="display-1 text-center my-2">{patientQueueNumber}</div>
                      <p className="mb-0 text-muted">
                        {patientQueueNumber === 1 ? (
                          <span className="text-success fw-bold">You&apos;re next! Please be ready.</span>
                        ) : (
                          <span>There are {patientQueueNumber - 1} patients ahead of you</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="row g-4">
                {/* Left side - Appointment Queue */}
                <div className="col-md-8">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Current Queue</h5>
                      <span className="badge bg-primary rounded-pill">{appointments.length} Appointments</span>
                    </div>
                    <div className="card-body p-0">
                      {appointments.length > 0 ? (
                        <div className="list-group list-group-flush">
                        {appointments.map((appt, index) => {
                          const isUserAppointment = patientIDsOwnedByUser.some((pid) => appt.docId.endsWith(`_${pid}`)); 
                          let statusBadge;
                          let statusIcon;
                          let statusText; // Declare statusText here

                          if (appt.status === "pending") {
                            statusBadge = "bg-secondary"; statusIcon = <FaUserClock />; statusText = "Waiting";
                          } else if (appt.status === "in progress") {
                            statusBadge = "bg-warning text-dark"; statusIcon = <FaSpinner />; statusText = "In Progress";
                          } else {
                            statusBadge = "bg-success"; statusIcon = <FaUserCheck />;statusText = "Seen";
                          }

                          return (
                            <div
                              key={appt.id}
                              className={`list-group-item ${
                                isUserAppointment ? "list-group-item-primary" : ""}`}
                            >
                              <div className="d-flex align-items-center">
                                <div
                                  className={`position-indicator rounded-circle d-flex align-items-center justify-content-center me-3 ${
                                    isUserAppointment ? "bg-primary" : "bg-secondary"
                                  }`}
                                  style={{ width: "40px", height: "40px", color: "white" }}
                                >
                                  {index + 1}
                                </div>

                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-0">{getPatientName(appt.id)}</h6>
                                      <small className="text-muted">ID: {appt.id}</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <span className={`badge ${statusBadge} d-flex align-items-center me-3`}>
                                        {statusIcon}
                                        <span className="ms-1">{statusText}</span>
                                      </span>

                                      {isUserAppointment && appt.status === "pending" && (
                                        <button
                                          className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                          onClick={() => handleRemove(appt.docId)}
                                          disabled={isLoading}
                                        >
                                          <FaUserMinus className="me-1" />
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      ) : (
                        <div className="text-center p-5">
                          <p className="text-muted mb-0">No appointments scheduled for this date</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Booking Controls */}
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Book an Appointment</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3 text-center">
                        <div className="position-indicator rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 bg-primary" style={{ width: "60px", height: "60px", color: "white", fontSize: "1.5rem" }}>
                          {nextPosition}
                        </div>
                        <div className="text-muted mb-3">Next Available Position</div>
                      </div>
                      
                      <div className="form-group mb-3">
                        <label htmlFor="patientSelect" className="form-label">Select Patient</label>
                        <select
                          id="patientSelect"
                          className="form-select"
                          value={selectedPatientID}
                          onChange={(e) => setSelectedPatientID(e.target.value)}
                          disabled={isLoading || queueStatus === "stopped"}
                        >
                          {patientList.map((patient) => (
                            <option key={patient.patient_ID} value={patient.patient_ID}>
                              {patient.firstName} {patient.lastName} (ID: {patient.patient_ID})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {hasAppointment && (
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                          <FaInfoCircle className="me-2" />
                          <div>This patient already has an appointment for this date.</div>
                        </div>
                      )}
                      
                      <button
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                        onClick={handleBook}
                        disabled={isLoading || queueStatus === "stopped" || hasAppointment}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : (
                          <FaCalendarAlt className="me-2" />
                        )}
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
    </ProtectedRoute>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {collection,query,orderBy,onSnapshot,getDocs,where,setDoc,doc} from "firebase/firestore";
import { createAppointment, getAllPatients } from "@/services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import Swal from "sweetalert2";
import AssistNavBar from "@/components/assistantSideBar";
import AddPatientModal from "@/components/addPatientModel";
import { FaCalendarAlt, FaUserPlus, FaCheck, FaExclamationTriangle, FaArrowRight, FaRedo } from "react-icons/fa";

// Format date as yyyy-mm-dd
const getFormattedDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Format date for display (e.g., Monday, May 8)
const getDisplayDate = (date) => {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
};

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [nextPosition, setNextPosition] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [queueStatus, setQueueStatus] = useState("stopped");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

 
  // Real-time listener for appointments on selected date
  useEffect(() => {
    const formattedDate = getFormattedDate(selectedDate);
    const q = query( collection(db, "appointments"), where("appointmentDate", "==", formattedDate), orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        docId: doc.id,
        ...doc.data(),
        queueNumber: index + 1
      }));
      setAppointments(data);
      setNextPosition(data.length + 1);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  // Handle date tab click
  const handleDateTabClick = (offset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  // Get all the patients into a combo box
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients(); // backend API call
        console.log("Patients fetch response:", response);
        if (response) {
          const options = response.data.map((p) => ({
            value: p.patient_id,
            label: `${p.patient_id} - ${p.firstName} ${p.LastName}`,
          }));
          setPatients(options);
        }
      } catch (error) {
        toast.error("Error fetching patients");
      }
    };
    fetchPatients();
  }, []);
  
  // get the queue status
  useEffect(() => {
    const fetchStatus = async () => {
      const statusDoc = await getDocs(
        query(collection(db, "queueStatus"), where("date", "==", getFormattedDate(selectedDate)))
      );
      if (!statusDoc.empty) {
        setQueueStatus(statusDoc.docs[0].data().status);
      } else {
        setQueueStatus("started"); // default
      }
    };
    fetchStatus();
  }, [selectedDate]);

  // Noify doctor arrival button
  const handleStartQueue = async () => {
    setIsLoading(true);
    try {
      const date = getFormattedDate(selectedDate);
      await setDoc(doc(db, "queueStatus", date), {
        date, status: "started", note: "Doctor has arrived"
      });
      setQueueStatus("started");
      toast.success("Queue started. Patients will be notified.");
    } catch (error) {
      toast.error("Error starting queue");
    } finally {
      setIsLoading(false);
    }
  };

  // stop the queue button
  const handleStopQueue = async () => {
    //open confirmation box
    const { value: note } = await Swal.fire({
      title: "Stop Queue", input: "textarea", inputLabel: "Reason for stopping the queue", inputPlaceholder: "Type your reason here...",
      inputAttributes: { "aria-label": "Type your reason here"}, showCancelButton: true, confirmButtonText: "Submit", confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      preConfirm: (note) => {
        if (!note) {
          Swal.showValidationMessage("You must provide a reason.");
        }
      }
    });
    //if confirmed save the note in the firebase queue status
    if (note) {
      setIsLoading(true);
      try {
        const date = getFormattedDate(selectedDate);
        await setDoc(doc(db, "queueStatus", date), {
          date,
          status: "stopped",
          note: note
        });
        setQueueStatus("stopped");
        toast.info("Queue stopped with note. Booking is disabled.");
      } catch (error) {
        toast.error("Error stopping queue");
      } finally {
        setIsLoading(false);
      }
    }
  };
    // handle the queue restart button
    const handleRestartQueue = async () => {
      setIsLoading(true);
      try {
        const date = getFormattedDate(selectedDate);
        await setDoc(doc(db, "queueStatus", date), {
          date,
          status: "started",
          note: "Queue has been restarted"
        });
        setQueueStatus("started");
        toast.success("Queue restarted successfully");
      } catch (error) {
        toast.error("Error restarting queue");
      } finally {
        setIsLoading(false);
      }
    };

    // handle temporary patient adding as a new patient
    const confirmBeforeSave = (appt) => {
    Swal.fire({
      title: 'Please Logout First',
      text: 'To proceed, please ask the temporary patient to logout.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK, Continue',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveAsPatient(appt); // Continue with saving as patient
      }
    });
  };
   const handleSaveAsPatient = (appt) => {
    setSelectedPatient(appt); // Set the selected patient
    setShowModal(true); // Open the modal
  };
  
  // Handle book appointment
  const handleBook = async () => {
    if (!patientID) {
      toast.error("Please select a patient");
      return;
    }
    // if the queue is stopped cant book
    const bookingDate = getFormattedDate(selectedDate);
    if (queueStatus === "stopped" && getFormattedDate(selectedDate) === bookingDate) {
      toast.error("Queue is stopped for today. Booking is disabled.");
      return;
    }
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "appointments"), where("appointmentDate", "==", bookingDate), where("id", "==", patientID)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        toast.error("This patient already has an appointment on this date.");
        return;
      }
      const data = await createAppointment(patientID, bookingDate);
        if(data.success) {
          toast.success("Appointment booked successfully!");
          setPatientID("");
        }
    } catch (errorMessage) {
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    console.log("Logged out");
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,borderRadius: '0.375rem',border: '1px solid #ced4da',boxShadow: 'none',
      '&:hover': {
        border: '1px solid #80bdff',
      }
    }),
    option: (provided, state) => ({
      ...provided,backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : null,color: state.isSelected ? 'white' : 'black',
    }),
  };

  return (
    <div className="bg-light min-vh-100">
      <AssistNavBar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>
        <div className="container py-5">
          <div className="card shadow-sm">
            <div className="card-header text-white py-3" style={{ background: 'rgba(32, 58, 67, 0.9)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">
                  <FaCalendarAlt className="me-2" /> Appointment Queue
                </h2>
                <span className="badge bg-white text-primary fs-6">
                  {getDisplayDate(selectedDate)}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              {/* Date Selection Tabs */}
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

              <div className="row g-4">
                {/* Queue Status Banner */}
                <div className="col-12">
                  <div className={`alert ${queueStatus === "started" ? "alert-success" : "alert-warning"} d-flex align-items-center`} role="alert">
                    {queueStatus === "started" ? (
                      <>
                        <FaCheck className="me-2" />
                        <div>Queue is active. Doctor is available and patients can be booked.</div>
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="me-2" />
                        <div>Queue is currently stopped. Booking is disabled.</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Left side - Appointment Queue */}
                <div className="col-md-8">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Current Queue</h5>
                    </div>
                    <div className="card-body p-0">
                      {appointments.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {appointments.map((appt, index) => (
                            <div
                              key={appt.docId}
                              className="list-group-item list-group-item-action d-flex align-items-center p-3"
                            >
                              <div className={`queue-number rounded-circle d-flex align-items-center justify-content-center me-3 ${
                                appt.status === "pending" ? "bg-danger" : "bg-success"
                              }`} style={{ width: "40px", height: "40px", color: "white" }}>
                                {index + 1}
                              </div>
                              <div className="ms-2 me-auto">
                                <div className="fw-bold">{appt.id}</div>
                                <div className="text-muted small">
                                  {appt.patientName}
                                </div>
                              </div>
                              <div className="d-flex flex-column align-items-end">
                                  <span className={`badge ${
                                    appt.status === "pending" ? "bg-danger" : "bg-success"
                                  } rounded-pill mb-2`}>
                                    {appt.status === "pending" ? "Waiting" : "Seen"}
                                  </span>

                                  {appt.temporary && (
                                     <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => confirmBeforeSave(appt)}
                                    >
                                      Save as Patient
                                    </button>
                                  )}
                                </div>
                            </div>
                          ))}
                        </div>
                        
                      ) : (
                        <div className="text-center p-5">
                          <p className="text-muted mb-0">No appointments scheduled for this date</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Booking and Controls */}
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Queue Controls</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-success d-flex align-items-center justify-content-center"
                          onClick={handleStartQueue}
                          disabled={queueStatus === "stopped" || isLoading}
                        >
                          <FaCheck className="me-2" />
                          Notify Doctor Arrival
                        </button>
                        <button
                          className="btn btn-danger d-flex align-items-center justify-content-center"
                          onClick={handleStopQueue}
                          disabled={!queueStatus === "stopped" || isLoading}
                        >
                          <FaExclamationTriangle className="me-2" />
                          Stop Queue
                        </button>
                        <button
                          className="btn btn-warning d-flex align-items-center justify-content-center"
                          onClick={handleRestartQueue}
                          disabled={queueStatus === "started" || isLoading}
                        >
                          <FaRedo className="me-2" />
                          Restart Queue
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Book Appointment</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-3">
                          <div className="queue-number rounded-circle d-flex align-items-center justify-content-center me-3 bg-primary" style={{ width: "40px", height: "40px", color: "white" }}>
                            {nextPosition}
                          </div>
                          <span>Next Available Position</span>
                        </div>
                        
                        <Select
                          styles={customSelectStyles}
                          className="mb-3"
                          placeholder="Search patient by name..."
                          options={patients}
                          isDisabled={isLoading || queueStatus === "stopped"}
                          onChange={(selectedOption) =>
                            setPatientID(selectedOption ? selectedOption.value : "")
                          }
                        />
                        
                        <button
                          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                          onClick={handleBook}
                          disabled={isLoading || queueStatus === "stopped" || !patientID}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          ) : (
                            <FaUserPlus className="me-2" />
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
      </div>
       {/* Conditionally render the Add patient modal */}
      {showModal && (
        <AddPatientModal
          showModal={true}  // Explicitly set to true since we're controlling visibility
          handleClose={() => setShowModal(false)}
          temp={true} 
          appointmentData={selectedPatient}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}
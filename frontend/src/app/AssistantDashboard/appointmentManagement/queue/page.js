"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../../lib/firebase.js";
import {collection,query,orderBy,onSnapshot,getDocs,where,setDoc, doc} from "firebase/firestore";
import { createAppointment , getAllPatients } from "../../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import AssistNavBar from "../../../../components/assistantSideBar";

// Format date as yyyy-mm-dd
const getFormattedDate = (date) => {
  return date.toISOString().split("T")[0];
};

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [nextPosition, setNextPosition] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [queueStatus, setQueueStatus] = useState("stopped");

  // Real-time listener for appointments on selected date
  useEffect(() => {
    const formattedDate = getFormattedDate(selectedDate);
    const q = query(
      collection(db, "appointments"),
      where("appointmentDate", "==", formattedDate),
      orderBy("createdAt", "asc")
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

  //handle date tab click
  const handleDateTabClick = (offset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  // Get sll the appointments into a combo box
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients(); // This should return the JSON from your backend
        if (response.success) {
          const options = response.patients.map((p) => ({
            value: p.patient_ID,
            label: `${p.patient_ID} - ${p.firstName} ${p.lastName}`,
          }));
          setPatients(options);
        }
      } catch (error) {
        toast.error("Error fetching patients");
      }
    };
    fetchPatients();
  }, []);
  
  useEffect(() => {
    const fetchStatus = async () => {
      const statusDoc = await getDocs(
        query(collection(db, "queueStatus"), where("date", "==", getFormattedDate(selectedDate)))
      );
      if (!statusDoc.empty) {
        setQueueStatus(statusDoc.docs[0].data().status);
      } else {
        setQueueStatus("stopped"); // default
      }
    };
    fetchStatus();
  }, [selectedDate]);

  const handleStartQueue = async () => {
    const date = getFormattedDate(selectedDate);
    await setDoc(doc(db, "queueStatus", date), {
      date,
      status: "started"
    });
    setQueueStatus("started");
    toast.success("Queue started. Patients will be notified.");
  };
  
  const handleStopQueue = async () => {
    const date = getFormattedDate(selectedDate);
    await setDoc(doc(db, "queueStatus", date), {
      date,
      status: "stopped"
    });
    setQueueStatus("stopped");
    toast.info("Queue stopped. Booking is disabled.");
  };
  

  //handle book appointment
  const handleBook = async () => {
    if (!patientID) {
      toast.error("Please enter patient details");
      return;
    }
    try {
      const bookingDate = getFormattedDate(selectedDate);
      // Check if the patient already has an appointment for the selected date
      const q = query(
        collection(db, "appointments"),
        where("appointmentDate", "==", bookingDate),
        where("id", "==", patientID)
      );
      const snapshot = await getDocs(q);
      //manage duplicate appointments for the same date
      if (!snapshot.empty) {
        toast.error("This patient already has an appointment on this date.");
        return;
      }
      // Book the appointment
      await createAppointment(patientID, bookingDate);
      toast.success("Appointment booked successfully!");
      setPatientID("");
    } catch (errorMessage) {
      toast.error(errorMessage);
    }
  };
  
  //logout function
  const logout = () => {
    console.log("Logged out");
  };

  return (
    <>
      <AssistNavBar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>
        <div className="container mt-4">
          <h2 className="text-center"> Appointment Queue </h2>
          <h4 className="text-center">{getFormattedDate(selectedDate)}</h4> {/* Display the date*/}
          <br />
          {/*appointment date tabs*/}
          <div className="mb-4 text-center">
            <div className="btn-group" role="group">
              {["Today", "Tomorrow", "Day After Tomorrow"].map((label, index) => (
                <button
                  key={label}
                  type="button"
                  className={`btn btn-outline-primary ${
                    getFormattedDate(selectedDate) ===
                    getFormattedDate(new Date(new Date().setDate(new Date().getDate() + index)))
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleDateTabClick(index)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2">
              Viewing appointments for: <strong>{getFormattedDate(selectedDate)}</strong>
            </p>
          </div>

          <div className="row">
            {/* Left side - Appointment Queue */}
            <div className="col-md-8">
              <div className="list-group">
                {appointments.map((appt, index) => (
                  <div
                    key={appt.docId}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      appt.status === "pending"
                        ? "list-group-item-danger"
                        : "list-group-item-success"
                    }`}
                  >
                    <span className="fw-bold">{index + 1}</span>
                    <span>{appt.id}</span>
                    <span>
                      {appt.status === "pending" ? (
                        <>
                          Booked by {appt.patientName} -{" "}
                          <strong>Not yet seen by the doctor</strong>
                        </>
                      ) : (
                        `Booked by ${appt.patientName}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Booking tab */}
            <div className="col-md-4 d-flex flex-column gap-3">
            <div className="text-center my-3">
              <button
                className="btn btn-success me-2"
                onClick={handleStartQueue}
                disabled={queueStatus === "started"}
              >
                Start Queue
              </button>
              <button
                className="btn btn-danger"
                onClick={handleStopQueue}
                disabled={queueStatus === "stopped"}
              >
                Stop Queue
              </button>
            </div>
              <div className="card p-3">
                <h5>Book the Next Available Position</h5>
                <p>
                  Next Available: <strong>Position {nextPosition}</strong>
                </p>
                <Select
                    className="mb-2"
                    placeholder="Search patient by name..."
                    options={patients}
                    onChange={(selectedOption) =>
                      setPatientID(selectedOption ? selectedOption.value : "")
                    }
                  />
                <button
                  className="btn btn-primary w-100"
                  onClick={handleBook}
                  disabled={queueStatus !== "started"}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../../lib/firebase";
import { collection, query, orderBy, onSnapshot ,doc, setDoc} from "firebase/firestore";
import { createAppointment } from "../../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "../../../../components/assistantSideBar";

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [nextPosition, setNextPosition] = useState(1);

  // For doctor availability setting
  const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
  const [availableUntil, setAvailableUntil] = useState("");

  // Real-time listener for doctor availability
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "doctorAvailability", "today"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsDoctorAvailable(data.available);
        setAvailableUntil(data.until);
      }
    });
    return () => unsub();
  }, []);
  

  // ✅ Real-time listener for appointments
  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setNextPosition(data.length + 1);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Book the next available slot
  const handleBook = async () => {
    if (!isDoctorAvailable) {
      toast.error("Doctor is not available today.");
      return;
    }

    if (!patientID || !patientName) {
      toast.error("Please enter patient details");
      return;
    }
    try {
      await createAppointment(patientID, patientName, new Date().toISOString().split("T")[0]);
      toast.success("Appointment booked successfully!");
      setPatientID("");
      setPatientName("");
    } catch (errorMessage) {
      toast.error(errorMessage);
    }
  };

  // Set the doctor availabiliity
  const handleSetAvailability = async () => {
    try {
      await setDoc(doc(db, "doctorAvailability", "today"), {
        available: true,
        until: availableUntil,
      });
      toast.success("Doctor marked available");
    } catch (err) {
      toast.error("Failed to set availability");
    }
  };
  
  //Clear the doctor availability
  const handleClearAvailability = async () => {
    try {
      await setDoc(doc(db, "doctorAvailability", "today"), {
        available: false,
        until: "",
      });
      toast.success("Doctor marked unavailable & queue cleared");
      // Optionally, clear today's appointments here if needed
    } catch (err) {
      toast.error("Failed to update status");
    }
  };
  

  // ✅ Placeholder logout handler
  const logout = () => {
    console.log("Logged out");
    // Add Firebase logout logic or navigation here if needed
  };

  return (
    <>
      <AssistNavBar onLogout={logout} />
      <div className="content-area"></div>
      <div className="container mt-4">
        <h2 className="text-center">Today&apos;s Appointment Queue</h2>

        <div className="card p-3 mb-3">
            <h5>Doctor Availability</h5>
            <input
              type="time"
              className="form-control mb-2"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
            />
            <button className="btn btn-success mb-2" onClick={handleSetAvailability}>
              Mark Available
            </button>
            <button className="btn btn-danger" onClick={handleClearAvailability}>
              Mark Unavailable
            </button>
        </div>

        <div className="row">
          {/* Queue View */}
          <div className="col-md-8">
            <div className="list-group">
              {appointments.map((appt, index) => (
                <div
                  key={appt.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    appt.status === "pending" ? "list-group-item-danger" : "list-group-item-success"
                  }`}
                >
                  <span className="fw-bold"> {index + 1}</span>
                  <span>{appt.id}</span>
                  <span>
                    {appt.status === "pending" ? (
                      <>
                        Booked by {appt.patientName} - <strong>Not yet seen by the doctor</strong>
                      </>
                    ) : (
                      `Booked by ${appt.patientName}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Panel */}
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Book the Next Available Position</h5>
              <p>
                Next Available: <strong>Position {nextPosition}</strong>
              </p>

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Patient ID"
                value={patientID}
                onChange={(e) => setPatientID(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />

              <button className="btn btn-primary w-100" onClick={handleBook}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

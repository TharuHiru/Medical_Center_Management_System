"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { createAppointment } from "../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [nextPosition, setNextPosition] = useState(1);

  // ✅ Real-time listener for appointments
  useEffect(() => {
    const q = query(collection(db, "appointments"), where("status", "!=", "completed"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setNextPosition(data.length + 1);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Book the next available slot
  const handleBook = async () => {
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

  return (
    <div className="container mt-4">
      <h2 className="text-center">Today&apos;s Appointment Queue</h2>

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
            <p>Next Available: <strong>Position {nextPosition}</strong></p>

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

      <ToastContainer />
    </div>
  );
}

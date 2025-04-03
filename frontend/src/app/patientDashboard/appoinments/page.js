"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { createAppointment } from "../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../context/AuthContext";

export default function AppointmentQueue() {
  const { userType, patientID } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientQueueNumber, setPatientQueueNumber] = useState(null);
  const [nextPosition, setNextPosition] = useState(1);

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({ id: doc.id, queueNumber: index + 1, ...doc.data() }));
      setAppointments(data);
      setNextPosition(data.length + 1);

      // Find patient's queue number
      const patientAppointment = data.find((appt) => appt.id === patientID);
      if (patientAppointment && patientAppointment.status === "pending") {
        setPatientQueueNumber(patientAppointment.queueNumber);
      } else {
        setPatientQueueNumber(null);
      }
    });
    return () => unsubscribe();
  }, [patientID]);

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

  const handleBook = async () => {
    if (!patientID) {
      toast.error("Please enter patient details");
      return;
    }
    try {
      await createAppointment(patientID, new Date().toISOString().split("T")[0]);
      toast.success("Appointment booked successfully!");
    } catch (errorMessage) {
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Today&apos;s Appointment Queue</h2>

      {/* Display patient's queue number or message */}
      <div className="text-center my-3">
        {patientQueueNumber ? (
          <h4 className="text-primary">Your Number: {patientQueueNumber}</h4>
        ) : (
          <h5 className="text-danger">You haven&apos;t booked an appointment today.</h5>
        )}
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="list-group">
            {appointments.map((appt, index) => (
              <div
                key={appt.id}
                className={`list-group-item d-flex justify-content-between align-items-center 
                  ${appt.id === patientID ? "list-group-item-primary" : appt.status === "pending" ? "list-group-item-danger" : "list-group-item-success"}`}
              >
                <span className="fw-bold"> {index + 1}</span>
                <span>
                  {appt.status === "pending" ? (
                    <strong>Not yet seen by the doctor</strong>
                  ) : (
                    <strong>Seen by the doctor</strong>
                  )}
                </span>
                {appt.id === patientID && appt.status === "pending" && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(appt.id)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Book the Next Available Position</h5>
            <p>Next Available: <strong>Position {nextPosition}</strong></p>

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Patient ID"
              value={patientID}
              disabled
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

"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../../lib/firebase.js";
import {collection,query,orderBy,onSnapshot,doc,getDoc,setDoc,updateDoc} from "firebase/firestore";
import { createAppointment } from "../../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "../../../../components/assistantSideBar";

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [nextPosition, setNextPosition] = useState(1);
  const [queueStarted, setQueueStarted] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];
  const queueDocRef = doc(db, "queueStatus", todayDate);

  // Fetch appointments
  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setNextPosition(data.length + 1);
    });
    return () => unsubscribe();
  }, []);

  // Fetch queue status
  useEffect(() => {
    const checkQueueStatus = async () => {
      const docSnap = await getDoc(queueDocRef);
      if (docSnap.exists()) {
        setQueueStarted(docSnap.data().started);
      } else {
        setQueueStarted(false);
      }
    };
    checkQueueStatus();
  }, []);

  // set the queue started
  const startQueue = async () => {
    await setDoc(queueDocRef, { started: true });
    setQueueStarted(true);
    toast.success("Queue started for today!");
  };

  //Set the queue stop
  const stopQueue = async () => {
    await updateDoc(queueDocRef, { started: false });
    setQueueStarted(false);
    toast.info("Queue has been stopped.");
  };

  // Booking appointment only if queue is started
  const handleBook = async () => {
    if (!queueStarted) {
      toast.error("Queue is not started yet.");
      return;
    }
    if (!patientID) {
      toast.error("Please enter patient details");
      return;
    }
    try {
      await createAppointment(patientID, todayDate);
      toast.success("Appointment booked successfully!");
      setPatientID("");
    } catch (errorMessage) {
      toast.error(errorMessage);
    }
  };

  // Logout fuction
  const logout = () => {
    console.log("Logged out");
  };

  return (
    <>
      <AssistNavBar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>
        <div className="container mt-4">
          <h2 className="text-center">Today&apos;s Appointment Queue</h2>
          <br />
          <div className="row">
            {/* Left side - Appointment Queue */}
            <div className="col-md-8">
              <div className="list-group">
                {appointments.map((appt, index) => (
                  <div
                    key={appt.id}
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

            {/* Right side - Booking and Queue Controls */}
            <div className="col-md-4 d-flex flex-column gap-3">

              {/* Queue Control Buttons */}
              <div className="card p-3">
                <h5>Queue Control</h5>
                <p>Status:{" "}
                  <strong style={{ color: queueStarted ? "green" : "red" }}>
                    {queueStarted ? "Queue Started" : "Queue Not Started"}
                  </strong>
                  <br />
                  <small className="text-muted">
                    {new Date().toLocaleDateString("en-CA")}
                  </small>
                </p>
                <div className="d-grid gap-2">
                  <button className="btn btn-success" onClick={startQueue} disabled={queueStarted}>
                    Start Queue
                  </button>
                  <button className="btn btn-danger" onClick={stopQueue} disabled={!queueStarted}>
                    Stop Queue
                  </button>
                </div>
              </div>

              {/* Booking Card */}
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
                <button
                  className="btn btn-primary w-100"
                  onClick={handleBook}
                  disabled={!queueStarted}
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

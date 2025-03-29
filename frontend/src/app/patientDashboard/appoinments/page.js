"use client";
import React, { useState, useEffect } from "react";
import { getAppointments, createAppointment } from "../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [nextPosition, setNextPosition] = useState(1);

  // ✅ Fetch appointments
  useEffect(() => {
    //get appoinments from the backend
    const fetchAppointments = async () => {
      const data = await getAppointments();
      // handle the error if appointments cannot fetch
      if (!data) {
        toast.error("Failed to fetch appointments");
        return;
      }
      else{
      setAppointments(data); // view the appoinments
      setNextPosition(data.length + 1); // Next available position
    };
    fetchAppointments();
  }}, []);

  // ✅ Book the next available slot
  const handleBook = async () => {
    if (!patientID || !patientName) {
      toast.error("Please enter patient details");
      return;
    }

    try {
      //send patient ID, name and date to create an appointment
      await createAppointment(patientID, patientName, new Date().toISOString().split("T")[0]);
      toast.success("Appointment booked successfully!");
      //view the newly created appointment details in the queue
      setAppointments([...appointments, { position: nextPosition, patientID, patientName, status: "pending" }]);
      setNextPosition(nextPosition + 1);
    } catch (errorMessage) {  // ✅ Now this will be just the string message
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
          {/*loop through the appointments  and view them in the frontend*/}
            {appointments.map((appt, index) => (
              <div
                key={index}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                //pending ones in red colour
                  appt.status === "pending" ? "list-group-item-danger" : "list-group-item-success"
                }`}
              >
                <span className="fw-bold"> {index + 1}</span>
                <span>
                  {/*add text not yet seen by the doctor*/}
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

"use client";
import { createAppointment } from "../../../services/appointmentService";
import { useState } from "react";

export default function AppointmentForm() {
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createAppointment(patientID, patientName, appointmentDate);
      alert("Appointment created successfully!");
    } catch (error) {
      console.error("Error creating appointment:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Patient ID" value={patientID} onChange={(e) => setPatientID(e.target.value)} />
      <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
      <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
      <button type="submit">Book Appointment</button>
    </form>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkExistingAppointment, createTemporaryAppointment } from "@/services/temporaryAppointmentService";

export default function TempPatientQueue() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState("started");
  const [queueNote, setQueueNote] = useState("");
  const [patientData, setPatientData] = useState(null);

  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  const getDisplayDate = (date) =>
    date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  // get data from the local storage and set it to the state
  useEffect(() => {
    const storedData = localStorage.getItem("temporarypatientData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPatientData(parsedData);
      setName(parsedData.name || "");
      setPhone(parsedData.phone || "");
    }
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "asc"),
      where("appointmentDate", "==", getFormattedDate(selectedDate))
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        ...doc.data(),
        docId: doc.id,
        queueNumber: index + 1,
      }));
      setAppointments(data);
    });

    return () => unsub();
  }, [selectedDate]);

  useEffect(() => {
    const fetchQueueStatus = async () => {
      try {
        const q = query(
          collection(db, "queueStatus"),
          where("date", "==", getFormattedDate(selectedDate))
        );
        const statusDocs = await getDocs(q);
        if (!statusDocs.empty) {
          const data = statusDocs.docs[0].data();
          setQueueStatus(data.status);
          setQueueNote(data.note || "");
        }
      } catch {
        toast.error("Error fetching queue status");
      }
    };
    fetchQueueStatus();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!name || !phone) {
      toast.error("Please enter name and phone number");
      return;
    }
    if (queueStatus === "stopped") {
      toast.error("Queue is currently stopped.");
      return;
    }
    const alreadyExists = await checkExistingAppointment(name, phone, selectedDate);
    if (alreadyExists) {
      toast.error("You already have an appointment on this day!");
      return;
    }

    try {
      setIsLoading(true);
      await createTemporaryAppointment(name, phone, selectedDate);
      toast.success("Appointment booked!");
    } catch {
      toast.error("Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAppointment = async (docId) => {
  try {
    const appointmentToRemove = appointments.find(appt => appt.docId === docId);

    if (appointmentToRemove && appointmentToRemove.phone === patientData?.phone) {
      await deleteDoc(doc(db, "appointments", docId));
      toast.success("Appointment removed successfully");
    } else {
      toast.error("You can only remove your own appointments");
    }
  } catch (error) {
    console.error("Error removing appointment:", error);
    toast.error("Failed to remove appointment");
  }
};

  const handleDateTabClick = (offset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Temporary Patient Appointment Queue</h2>
      <h1>Welcome, {patientData?.name}</h1>
      <p>Phone: {patientData?.phone}</p>

      <div className="text-center mb-3">
        {[{ label: "Today", offset: 0 }, { label: "Tomorrow", offset: 1 }, { label: "Day After", offset: 2 }].map(
          ({ label, offset }) => (
            <button
              key={label}
              className={`btn btn-outline-primary mx-1 ${
                getFormattedDate(new Date(new Date().setDate(new Date().getDate() + offset))) ===
                getFormattedDate(selectedDate)
                  ? "active"
                  : ""
              }`}
              onClick={() => handleDateTabClick(offset)}
            >
              {label}
            </button>
          )
        )}
      </div>

      {queueStatus === "stopped" && (
        <div className="alert alert-danger">Queue Stopped: {queueNote}</div>
      )}
      {queueStatus === "started" && queueNote && (
        <div className="alert alert-info">Doctor Notice: {queueNote}</div>
      )}

      <div className="card p-4 mb-4">
        <h5>Book an Appointment</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Your Full Name"
          value={patientData?.name}
          readOnly
        />
        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Phone Number"
          value={patientData?.phone}
          readOnly
        />
        <button className="btn btn-primary" onClick={handleBook} disabled={isLoading}>
          {isLoading ? "Booking..." : "Book Appointment"}
        </button>
      </div>

      <h5>Appointments for {getDisplayDate(selectedDate)}</h5>
      {appointments.length === 0 ? (
        <p>No appointments for this day.</p>
      ) : (
        <ul className="list-group">
          {appointments.map((appt) => (
            <li key={appt.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {appt.queueNumber} - {appt.name || "Unnamed"} ({appt.phone})
              </div>
              {appt.phone === patientData?.phone && (
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveAppointment(appt.docId)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
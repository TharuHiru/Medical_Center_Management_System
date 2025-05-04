"use client";

import React, { useState, useEffect } from 'react';
import '../../../Styles/AssistantDashboard.css';
import '../../../Styles/loginForms.css';
import { admitPatient } from "../../../services/appointmentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorNavBar from '../../../components/doctorSideBar';
import PrescriptionModal from "../../../components/AddPrescriptionModel";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, where } from "firebase/firestore";

//  format dates as YYYY-MM-DD
const getFormattedDate = (date) => {
  return date.toISOString().split('T')[0];
};

function DoctorQueue() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  //real time listner to appointment queue
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
    });
    return () => unsubscribe();
  }, [selectedDate]);

  const handleDateTabClick = (offset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  // handle admit patient
  const handleAdmit = async (appointment) => {
    console.log("Admitting patient:", appointment.id);
    try {
      const response = await admitPatient(appointment.id, appointment.appointmentDate);
      if (response.success) {
        toast.success("Patient admitted successfully!");
      } else {
        toast.error(response.error || "Failed to admit patient.");
      }
    } catch (error) {
      toast.error("Error admitting patient.");
    }
  };

  const handleRemove = async (appointmentId) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await deleteDoc(appointmentRef);
      toast.success("Appointment removed successfully!");
    } catch (error) {
      toast.error("Error removing appointment.");
    }
  };

  //logout function
  const logout = () => {
    toast.info("Logging out...");
  };

  return (
    <div className="dashboard-container">
      <DoctorNavBar onLogout={logout} />
      <div className="content-area" style={{ marginLeft: "260px" }}>

      <div className ="container mt-4">
      <div className="row">
        <div className="col text-center">
          <h2>Appointment Queue</h2>
          <h4>{getFormattedDate(selectedDate)}</h4>
        </div>
      </div>

        {/* Appointment Date Tabs */}
        <div className="mb-4 text-center">
          <div className="btn-group" role="group">
            {["Today", "Tomorrow", "Day After Tomorrow"].map((label, index) => {
              const tabDate = new Date();
              tabDate.setDate(tabDate.getDate() + index);
              return (
                <button
                  key={label}
                  type="button"
                  className={`btn btn-outline-primary ${
                    getFormattedDate(selectedDate) === getFormattedDate(tabDate) ? "active" : ""
                  }`}
                  onClick={() => handleDateTabClick(index)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="mt-2">
            Viewing appointments for: <strong>{getFormattedDate(selectedDate)}</strong>
          </p>
        </div>

        <div className="col-md-9 mt-4">
          <h4 className="text-center">Patient Queue for Doctor</h4>
          <div className="list-group">
            {appointments.map((appt, index) => (
              <div
                key={appt.docId}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  appt.status === "pending" ? "list-group-item-danger" : "list-group-item-success"
                }`}
              >
                <span className="fw-bold">#{index + 1}</span>
                <span>{appt.id}</span>
                <span>
                  {appt.status === "pending" && <strong> - Not yet seen by the doctor</strong>}
                </span>
                {appt.status === "pending" && (
                  <button className="btn btn-primary" onClick={() => handleAdmit(appt)}>
                    Admit
                  </button>
                )}
                {appt.status === "in progress" && (
                  <>
                    <button className="btn btn-danger" onClick={() => handleRemove(appt.docId)}>
                      Remove
                    </button>
                    <button
                      className="loginBtn"
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setShowModal(true);
                      }}
                    >
                      Add Prescription
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Prescription Modal */}
          <PrescriptionModal
            show={showModal}
            handleClose={() => {
              setShowModal(false);
              setSelectedAppointment(null);
            }}
            patientId={selectedAppointment?.id}
            appointmentID={selectedAppointment?.appointment_ID}
          />
        </div>
      </div>
    </div>
    </div>
  );
}

export default DoctorQueue;

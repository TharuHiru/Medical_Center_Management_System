"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, where } from "firebase/firestore";
import { admitPatient } from "@/services/appointmentService";
import { db } from "@/lib/firebase";
import DoctorNavBar from '@/components/doctorSideBar';
import PrescriptionModal from "@/components/AddPrescriptionModel";

// Styles
import '@/Styles/AssistantDashboard.css';
import '@/Styles/loginForms.css';
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Format dates as YYYY-MM-DD
const getFormattedDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Date formatting for display
const formatDisplayDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}).format(date);
};

function DoctorQueue() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Real-time listener to appointment queue
  useEffect(() => {
    setIsLoading(true);
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
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [selectedDate]);

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDateTabClick = (offset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  // Handle admit patient
  const handleAdmit = async (appointment) => {
    try {
      toast.info("Admitting patient...");
      const response = await admitPatient(appointment.id, appointment.appointmentDate);
      
      if (response.success) {
        toast.success("Patient admitted successfully!");
      } else {
        toast.error(response.error || "Failed to admit patient.");
      }
    } catch (error) {
      console.error("Error admitting patient:", error);
      toast.error("Error admitting patient.");
    }
  };

  // Handle remove appointment details from the queue
  const handleRemove = async (appointmentId) => {
    try {
      toast.info("Removing appointment...");
      const appointmentRef = doc(db, "appointments", appointmentId);
      await deleteDoc(appointmentRef);
      toast.success("Appointment removed successfully!");
    } catch (error) {
      console.error("Error removing appointment:", error);
      toast.error("Error removing appointment.");
    }
  };

  //handle add prescription
  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const logout = () => {
    toast.info("Logging out...");
    // Add actual logout logic here
  };

  // Render appointment card based on status
  const renderAppointmentCard = (appt, index) => {
  const isPending = appt.status === "pending";
  const isTemp = appt.temporary === true;
  const statusClass = isPending ? "list-group-item-warning" : "list-group-item-success";
  
  return (
    <div
      key={appt.docId}
      className={`list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center ${statusClass} mb-2 shadow-sm rounded p-3`}
    >
      <div className="d-flex align-items-center mb-2 mb-md-0">
        <span className="badge bg-primary rounded-pill me-3">#{index + 1}</span>
        <div>
          <h5 className="mb-1">{appt.id}</h5>
          <p className="mb-0 text-muted small">
            {isPending ? "Waiting to be seen" : "Currently with doctor"}
          </p>
        </div>
      </div>
      
      {/* Control Buttons - Corrected Logic */}
      <div className="d-flex flex-column flex-sm-row gap-2 mt-2 mt-md-0">
        {!isTemp && isPending && (
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => handleAdmit(appt)}
          >
            <i className="fas fa-user-check me-1"></i> Admit
          </button>
        )}
        
        {!isTemp && !isPending && (
          <React.Fragment>
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => handleAddPrescription(appt)}
            >
              <i className="fas fa-prescription me-1"></i> Add Prescription
            </button>
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={() => handleRemove(appt.docId)}
            >
              <i className="fas fa-times me-1"></i> Remove
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

  return (
    <div className="dashboard-container bg-light min-vh-100 d-flex flex-column overflow-hidden">
      <div className="d-lg-none position-fixed top-0 start-0 p-3" style={{ zIndex: 1000 }}>
        <button className="btn btn-primary" onClick={toggleSidebar}>
          <i className={`fas fa-${sidebarCollapsed ? 'bars' : 'times'}`}></i>
        </button>
      </div>
      
      <DoctorNavBar onLogout={logout} collapsed={sidebarCollapsed} />
      
      <div className="content-area" 
           style={{ 
             marginLeft: sidebarCollapsed ? "0" : "260px", 
             transition: "margin-left 0.3s ease-in-out",
             width: sidebarCollapsed ? "100%" : "calc(100% - 260px)",
             maxWidth: "100%",
             overflowX: "hidden"
           }}>
        <div className="container p-3 p-md-4">
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body text-center" style={{ background: 'rgba(32, 58, 67, 0.9)' }}>
                  <h2 className="card-title text-white">Patient Queue Dashboard</h2>
                  <h5 className="text-white">{formatDisplayDate(selectedDate)}</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection Tabs */}
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
              </div>

          {/* Appointments List */}
          <div className="row">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h4 className="mb-2 mb-md-0">Patient Queue</h4>
                    <span className="badge bg-info">
                      {appointments.length} {appointments.length === 1 ? 'patient' : 'patients'}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3">Loading appointments...</p>
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="list-group">
                      {appointments.map((appt, index) => renderAppointmentCard(appt, index))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <h5>No appointments scheduled</h5>
                      <p className="text-muted">There are no patients in the queue for this date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
  );
}

export default DoctorQueue;
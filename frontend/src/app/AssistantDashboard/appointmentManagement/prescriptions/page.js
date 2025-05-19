'use client';

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "@/components/assistantSideBar";
import BillingForm from "@/components/billingForm";
import Receipt from "@/components/receipt";   
import Image from "next/image";
import ProtectedRoute from '@/components/protectedRoute';
import { sendPrescriptionEmail,getPatientEmail } from '@/services/prescriptionPdfService';


export default function AppointmentQueue() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const printRef = useRef();
  const billingRef = useRef(null);
  const [showBillingForm, setShowBillingForm] = useState(false);

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const sendToMail = async () => {
  try {
    if (!selectedPrescription) return;
    
    // Get the HTML content
    const prescriptionHtml = printRef.current.innerHTML;
    
    // Convert local images to base64
    const images = printRef.current.querySelectorAll('img');
    for (const img of images) {
      if (img.src.startsWith('http')) continue;
      
      const response = await fetch(img.src);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
      img.src = base64;
    }

    // Get patient email from service
    const patientEmail = await getPatientEmail(selectedPrescription.patient_ID);
    console.log("Patient Email:", patientEmail);
    // Send via service
    await sendPrescriptionEmail({
      htmlContent: printRef.current.innerHTML,
      patientEmail, // Replace with dynamic email
      patientName: selectedPrescription.patientName
    });

    toast.success("Prescription sent to email successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    toast.error("Failed to send email");
  }
};

  // This will be passed to Receipt component
  const onCloseAll = () => {
    setShowPrescriptionModal(false);
    setShowBillingModal(false);
    setShowReceiptModal(false);
  };

  const [prescriptionRows, setPrescriptionRows] = useState([
    { medicine_ID: "", dosage: "", units: 1 }
  ]);
  
  //row change handler
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...prescriptionRows];
    updatedRows[index][field] = value;
    setPrescriptionRows(updatedRows);
  };
  
  //Adding a new row to the table
  const addRow = () => {
    setPrescriptionRows([...prescriptionRows, { medicine_ID: "", dosage: "", units: 1 }]);
  };
  
  //Removing a row from the table
  const removeRow = (index) => {
    const updatedRows = [...prescriptionRows];
    updatedRows.splice(index, 1);
    setPrescriptionRows(updatedRows);
  };
  
//Real tiime firebase listening for prescriptions
  useEffect(() => {
    const q = query(collection(db, "prescriptions"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPrescriptions(data);
    });
    return () => unsubscribe();
  }, []);

  // Scroll to the selected prescription when it changes
  useEffect(() => {
    if (selectedPrescription && printRef.current) {
      printRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedPrescription]);

  // Scroll to the billing form when it is shown
  useEffect(() => {
    if (showBillingForm) {
      if (billingRef.current) {
        billingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [showBillingForm]);
  
  //open printing model when it is selected
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  //close all models
  const handleCloseAll = () => {
    setShowBillingForm(false);
    setSelectedPrescription(null);
    //setShowReceipt(false); 
  };

  return (
    <>
    <ProtectedRoute>
      {/* Prescription to be billed section */}
      <div className="d-flex">
            <AssistNavBar />
            <div className="content-area flex-grow-1 p-4 ">
              <div className="container">
                <h2 className="fw-bold mb-4">Billing Queue</h2>
                
                <div className="card border-0 shadow-sm">
                  <div className="card-header  py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Pending Prescriptions</h5>
                      <span className="badge bg-primary rounded-pill">
                        {prescriptions.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body p-0">
                    {prescriptions.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1"></i>
                        <p className="mt-3">No prescriptions in queue</p>
                      </div>
                    ) : (
                      <div className="prescription-list">
                        {prescriptions.map((prescription, index) => (
                          <div
                            key={prescription.id}
                            className="prescription-item p-3 border-bottom d-flex justify-content-between align-items-center"
                          >
                            <div className="prescription-details">
                              <div className="d-flex align-items-center">
                                <span className="text-muted me-3">{index + 1}</span>
                                <div>
                                  <h6 className="mb-1">{prescription.patientName}</h6>
                                  <small className="text-muted">ID: {prescription.id}</small>
                                </div>
                              </div>
                            </div>
                            
                            <div className="d-flex align-items-center">
                              {prescription.status === "pending" && (
                                <span className="badge bg-warning text-dark me-3">Pending</span>
                              )}
                              <button
                                className="btn btn-primary btn-sm px-4"
                                onClick={() => setSelectedPrescription(prescription)}
                              >
                                Process
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Prescription details section */}
            {selectedPrescription && (
              <>
                <div className="container mt-5" ref={printRef}>
                  <div className="row justify-content-center">
                    <div className="col-md-8"> 
                      <div className="card shadow p-4 rounded" style={{ borderColor: "transparent" }}>
                              {/* Header with logo and description */}
                            <div className="d-flex align-items-center mb-5">
                              <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="me-5" />
                            <div>
                          <h3 className="mb-1">Polyclinic Medical Center</h3>
                          <p className="mb-0 text-muted" style={{ fontSize: "1rem" }}>
                            Temple Road, Thalawathugoda, Sri Lanka | Phone: 071-7517940 <br />
                            Providing quality healthcare with compassion and care.
                          </p>
                        </div>
                      </div>
                        <h4 className="text-center mb-4">Prescription Details</h4>
                        <div className="d-flex justify-content-center">
                          <table
                            className="table table-bordered"
                            style={{ width: "70%", borderColor: "transparent" }}
                          >
                            <tbody>
                              <tr>
                                <th scope="row" className="text-end">Prescription ID:</th>
                                <td className="text-start">{selectedPrescription.id}</td>
                              </tr>
                              <tr>
                                <th scope="row" className="text-end">Patient Name :</th>
                                <td className="text-start">{selectedPrescription.patientName}</td>
                              </tr>
                              <tr>
                                <th scope="row" className="text-end">Age :</th>
                                <td className="text-start">{selectedPrescription.Age}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row" className="text-end">Date:</th>
                                <td className="text-start">{selectedPrescription.date}</td>
                              </tr>
                              <tr>
                                <th scope="row" className="text-end">Diagnosis:</th>
                                <td className="text-start">{selectedPrescription.diagnosis}</td>
                              </tr>
                              <tr>
                                <th scope="row" className="text-end">Other Notes:</th>
                                <td className="text-start">{selectedPrescription.otherNotes || "N/A"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h5 className="text-center mt-4">Medicines</h5>
                        <div className="d-flex justify-content-center">
                          <table
                            className="table table-bordered"
                            style={{ width: "90%", borderColor: "#dee2e6" }}
                          >
                            <thead className="table-light">
                              <tr>
                                <th>Medicine</th>
                                <th>Dosage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedPrescription.medicines &&
                                selectedPrescription.medicines.map((med, idx) => (
                                  <tr key={idx}>
                                    <td>{med.medicine_Name}</td>
                                    <td>{med.dosage}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Button and goto billing button section */}
                <div className="text-center mt-4">
                  <button className="btn btn-success me-3" onClick={handlePrint}>                         Print Prescription </button>
                  <button className="btn btn-danger me-3"  onClick={() => setShowBillingForm(true)}>      Go to Billing      </button>
                  <button className="btn btn-primary me-3" onClick={sendToMail} >                         Send to mail       </button>
                  <button className="btn btn-secondary "   onClick={() => setSelectedPrescription(null)}> Back to List       </button>
                </div>
              </>
            )}

            {/* Billing form section */}
            {showBillingForm && (
                <BillingForm
                  prescriptionRows={prescriptionRows}
                  handleRowChange={handleRowChange}
                  removeRow={removeRow}
                  addRow={addRow}
                  billingRef={billingRef}
                  prescriptionId={selectedPrescription?.id}
                  patientEmail
                  onCloseAll={handleCloseAll}
                />
              )}             
      <ToastContainer />
      </ProtectedRoute>
    </>    
  );
}

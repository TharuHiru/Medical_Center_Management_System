"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "../../../../components/assistantSideBar";

export default function AppointmentQueue() {
  const [prescriptions, setPrescriptions] = useState([]);

  // ✅ Real-time listener for prescriptions
  useEffect(() => {
    const q = query(collection(db, "prescriptions"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPrescriptions(data);
    });
    return () => unsubscribe();
  }, []);

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
        <h2 className="text-center mb-4">Prescriptions to be Billed</h2>

        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="list-group">
              {prescriptions.length === 0 ? (
                <div className="text-center">No prescriptions in queue</div>
              ) : (
                prescriptions.map((prescription, index) => (
                  <div
                    key={prescription.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      prescription.status === "pending"
                        ? "list-group-item-warning"
                        : "list-group-item-success"
                    }`}
                  >
                    <span className="fw-bold">{index + 1}</span>
                    <span>{prescription.id}</span>
                    <span>
                      Name : <strong>{prescription.patientName}</strong>
                      {prescription.status === "pending" && (
                        <span> – <em>Not yet billed</em></span>
                      )}
                    </span>
                    <span>
                      <button className="btn btn-primary w-100">Proceed</button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

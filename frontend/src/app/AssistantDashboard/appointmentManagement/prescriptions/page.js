'use client';

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "../../../../components/assistantSideBar";
import {fetchMedicineCategory,} from "../../../../services/inventoryService";


export default function AppointmentQueue() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const printRef = useRef();
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [medicines, setMedicines] = useState([]);
  const billingRef = useRef(null);
  const [showBillingForm, setShowBillingForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "prescriptions"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPrescriptions(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedPrescription && printRef.current) {
      printRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedPrescription]);

  useEffect(() => {
    if (showBillingForm) {
      fetchMedicines(); 
      if (billingRef.current) {
        billingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [showBillingForm]);

  useEffect(() => {
    if (showBillingForm) {
      fetchMedicines(); // LET'S GET THOSE MEDS
    }
  }, [showBillingForm]);
  

  // Fetch medicines from Firebase or your API
  const fetchMedicines = async () => {
    try {
      const response = await fetchMedicineCategory(); // Your API or Firebase call here
      if (response.success) {
        setMedicines(response.data); // Set the fetched medicines in the state
      } else {
        alert("Failed to load medicines");
      }
    } catch (error) {
      alert("Error fetching medicines: " + error.message);
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const logout = () => {
    console.log("Logged out");
  };

  return (
    <>
      <div className="d-flex">
        <AssistNavBar onLogout={logout} />
        <div className="content-area flex-grow-1 p-4">
          <div className="container">
            <h2 className="text-center mb-4">Prescriptions to be Billed</h2>

            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="list-group shadow-sm">
                  {prescriptions.length === 0 ? (
                    <div className="text-center">No prescriptions in queue</div>
                  ) : (
                    prescriptions.map((prescription, index) => (
                      <div
                        key={prescription.id}
                        className={`list-group-item d-flex justify-content-between align-items-center mb-2 rounded list-group-item-success`}
                      >
                        <span className="fw-bold">{index + 1}</span>
                        <span>{prescription.id}</span>
                        <span>
                          Name: <strong>{prescription.patientName}</strong>
                          {prescription.status === "pending" && (
                            <span> – <em>Not yet billed</em></span>
                          )}
                        </span>
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          Proceed
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Prescription details section */}
            {selectedPrescription && (
              <>
                {/* Print Area */}
                <div className="container mt-5" ref={printRef}>
                  <div className="row justify-content-center">
                    <div className="col-md-10">
                      <div className="card shadow p-4 rounded">
                        <h4 className="text-center mb-4">Prescription Details</h4>

                        <div className="d-flex justify-content-center">
                          <table
                            className="table table-bordered"
                            style={{ width: "90%", borderColor: "#dee2e6" }}
                          >
                            <tbody>
                              <tr>
                                <th scope="row" className="text-end">Prescription ID:</th>
                                <td className="text-start">{selectedPrescription.id}</td>
                              </tr>
                              <tr>
                                <th scope="row" className="text-end">Patient Name:</th>
                                <td className="text-start">{selectedPrescription.patientName}</td>
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

                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <button className="btn btn-success me-3" onClick={handlePrint}>
                    Print Prescription
                  </button>
                  <button className="btn btn-danger me-3" onClick={() => setShowBillingForm(true)}>
                      Go to Billing
                    </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedPrescription(null)}
                  >
                    Back to List
                  </button>
                </div>
              </>
            )}

            {/* Billing form section */}
            {showBillingForm && (
              <div className="container mt-5" ref={billingRef}>
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <div className="card shadow p-4 rounded">
                      <h4 className="text-center mb-4">Billing Details</h4>
                      <form>
                        <div className="mb-3">
                          <label htmlFor="billAmount" className="form-label">Service Charge : </label>
                          <input type="number" className="form-control" id="billAmount" required />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="paymentMethod" className="form-label">Medicine</label>
                          <select
                            className="form-select"
                            id="paymentMethod"
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                            required
                          >
                            <option value="">Select Medicine</option>
                            {medicines.length > 0 ? (
                              medicines.map((medicine) => (
                                <option key={medicine.medicine_ID} value={medicine.medicine_ID}>
                                  {medicine.medicine_Name}
                                </option>
                              ))
                            ) : (
                              <option value="">No medicines available</option>
                            )}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="NoOfUnits" className="form-label">No Of Units : </label>
                          <input type="number" className="form-control" id="NoOfUnits" rows="3"></input>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="notes" className="form-label">Full Amount : </label>
                          <input type="Number" className="form-control" id="notes" rows="3" readOnly></input>
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn btn-success">Submit Billing</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

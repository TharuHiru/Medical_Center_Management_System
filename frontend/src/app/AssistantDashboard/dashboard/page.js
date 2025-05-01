"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "../../../components/assistantSideBar";
import { collection, getDocs, deleteDoc, query, doc, setDoc, onSnapshot } from "firebase/firestore";

function AssistantDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = `${searchParams.get("firstname")} ${searchParams.get("lastname")}`;

  const [unavailableDate, setUnavailableDate] = useState("");
  const [note, setNote] = useState("");
  const [availabilityList, setAvailabilityList] = useState([]);

  //Real time tracking of doctor availabillity
  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const q = query(collection(db, "doctorAvailability"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const upcoming = [];

      snapshot.forEach((docSnap) => {
        const docDate = docSnap.id;
        if (docDate >= todayDate) {
          upcoming.push({ id: docDate, ...docSnap.data() });
        }
      });
      setAvailabilityList(upcoming.sort((a, b) => a.id.localeCompare(b.id)));
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Add a note for a day
  const handleSaveNote = async () => {
    if (!unavailableDate) return toast.error("Select a date");
    if (!unavailableDate || !note.trim()) {
      return toast.error("Please enter a note");
    }
    await setDoc(doc(db, "doctorAvailability", unavailableDate), {
      note: note,
    }, { merge: true }); // Don't overwrite other data
    setNote ("");
    setUnavailableDate("");
    toast.success("Note saved for the doctor");
  };

  //remove an existing note
  const handleRemoveAvailability = async (date) => {
    await deleteDoc(doc(db, "doctorAvailability", date));
    toast.success(`Note removed for ${date}`);
    setAvailabilityList((prev) => prev.filter((item) => item.id !== date));
  };  

  //logout logic
  const logout = () => {
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      <AssistNavBar onLogout={logout} />
      <div className="content-area container mt-4">
        <div className="text-center mb-4">
          <h5 className="assistant-name">Hello, {username}</h5>
          <p className="greeting-text">Welcome back!</p>
        </div>

        {/* Note adding Tab */}
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card p-4 shadow-sm rounded">
              <h5 className="mb-3 text-center">Notes</h5>

              <div className="mt-3">
                <h6>Notes</h6>
                {availabilityList.length === 0 ? (
                  <p className="text-center text-muted">No Upcoming Notes.</p>
                ) : (
                  <div className="list-group">
                    {availabilityList.map((item) => {
                      const isPast = new Date(item.id) < new Date().setHours(0, 0, 0, 0);
                      return (
                        <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{item.id}</strong><br />
                            {item.note ? (
                              <small>Note: {item.note}</small>
                            ) : (
                              <small className="text-muted">No notes</small>
                            )}
                          </div>
                          {!isPast && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveAvailability(item.id)}>
                              Remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mb-3 mt-4">
                <label>Select a Date </label>
                <input
                  type="date"
                  className="form-control"
                  value={unavailableDate}
                  onChange={(e) => setUnavailableDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Note (optional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Doctor only available for emergencies"
                />
              </div>
              <div className="row">
              <div className="col-12">
                <button className="btn btn-primary w-100" onClick={handleSaveNote}>
                  Save Note
                </button>
              </div>
             </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AssistantDashboard;

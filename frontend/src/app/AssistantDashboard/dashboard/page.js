"use client";

import React, { useState , useEffect  } from "react";
import { db } from "../../../lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AssistNavBar from "../../../components/assistantSideBar";
import {onSnapshot,doc,setDoc,} from "firebase/firestore";


function AssistantDashboard() {
  const router = useRouter();

  const searchParams = useSearchParams(); // get the search parameters from the URL
  const username = `${searchParams.get("firstname")} ${searchParams.get("lastname")}`;

  const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
    const [availableUntil, setAvailableUntil] = useState("");
    const [unavailableDate, setUnavailableDate] = useState("");
    const [note, setNote] = useState("");
  
    //check the real time doctor availability document
    useEffect(() => {
      const todayDate = new Date().toISOString().split("T")[0]; //get today date
      const unsub = onSnapshot(doc(db, "doctorAvailability", todayDate), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsDoctorAvailable(data.available !== false); // st unavailabe
          setAvailableUntil(data.until || "");
          setNote(data.note || "");
        } else {
          setIsDoctorAvailable(true); // default = available
          setAvailableUntil("");
          setNote("");
        }
      });
      return () => unsub();
    }, []);
    
    //Handling setting doctor availability
  const handleSetAvailability = async () => {
    if (!unavailableDate) return toast.error("Select a date");
    await setDoc(doc(db, "doctorAvailability", unavailableDate), {
      available: true,
      until: availableUntil,
      note: note,
    });
    toast.success("Doctor marked available");
  };

  //Handling clearing doctor availability
  const handleClearAvailability = async () => {
    if (!unavailableDate) return toast.error("Select a date");
    await setDoc(doc(db, "doctorAvailability", unavailableDate), {
      available: false,
      until: "",
      note: note,
    });
    toast.success("Doctor marked unavailable");
  };

  // Dummy logout function (replace with actual logout logic)
  const logout = () => {
    console.log("Logging out...");
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} />

      <div className="content-area">
        <div className="greeting-container">
          <h5 className="assistant-name">Hello, {username}</h5>
          <p className="greeting-text">Welcome back!</p>
        </div>

        <div className="card p-3">
                <h5>Doctor Availability</h5>
                <input
                  type="time"
                  className="form-control mb-3"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                />
                <div className="mb-3">
                  <label>Set Doctor Unavailable On:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={unavailableDate}
                    onChange={(e) => setUnavailableDate(e.target.value)}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-success w-100"
                      onClick={handleSetAvailability}
                    >
                      Mark Available
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-danger w-100"
                      onClick={handleClearAvailability}
                    >
                      Mark Unavailable
                    </button>
                  </div>
                </div>
              </div>

              {/*Note adding block*/}
              <div className="mb-3">
                <label>Note (optional):</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Doctor only available for emergencies"
                />
              </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AssistantDashboard;

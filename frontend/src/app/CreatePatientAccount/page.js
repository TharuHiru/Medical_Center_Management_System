"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import the Navbar component
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { sendVerification } from "../../services/patientAuthService";

const CreatePatient = () => {
  const [PID, setpatientID] = useState('');
  const router = useRouter(); // Initialize the router

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sendVerification(PID); // Use the actual Patient ID
      console.log(response.message);

      // If verification email is sent successfully, navigate to code form page
      router.push('/AccountCode'); 
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Account</h2>
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="patientID" className="form-label">Patient ID:</label>
              <input
                type="text"
                className="form-control"
                id="patientID"
                value={PID}
                onChange={(e) => setpatientID(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Create Account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreatePatient;

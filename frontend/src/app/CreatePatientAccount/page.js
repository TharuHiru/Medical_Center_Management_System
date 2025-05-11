"use client";

import React, { useState } from "react";
import BackNavbar from "@/components/backNavBar"; // Import the Navbar component
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { sendVerification } from "@/services/patientAuthService";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const CreatePatient = () => {
  const [PID, setpatientID] = useState('');
  const router = useRouter(); // Initialize the router

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sendVerification(PID); // Call API to send verification
      console.log(response.message);

      // Show success toast
      toast.success("Verification email sent successfully!", {
        position: "top-right",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Navigate to code form page after short delay
      setTimeout(() => {
        router.push('/AccountCode');
      }, 3000);
      
    } catch (error) {
      console.error("Error sending verification code:", error);

      // Show error toast based on response message
      toast.error(error.response?.data?.error || "Failed to send verification code.", {
        position: "top-right",
        autoClose: 5000, // Auto close after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div>
      <BackNavbar />
      <ToastContainer /> {/* Add ToastContainer for displaying toasts */}
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

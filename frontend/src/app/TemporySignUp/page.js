"use client"; // ✅ This makes the file a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ uses "next/navigation"
import BackNavbar from "@/components/backNavBar";
import { temporyPatientSignUp } from "@/services/temporyPatientService"; // Import service
import Link from "next/link";
import "@/Styles/loginForms.css";

const TemporySignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const router = useRouter(); // Initialize the router

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submitPatientData = async () => {
    try {
      const response = await temporyPatientSignUp(formData); // Call the service function
  
      if (response.success) {
        alert("Temporary patient added successfully");
        router.push("/TemporyLogin"); 
      } else {
        alert(response.message || "Error adding temporary patient");
      }
    } catch (error) {
      console.error("Error adding temporary patient:", error);
      alert(error.response?.data?.message || "An error occurred while adding the patient");
    }
  };
  
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    submitPatientData();
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Temporary Patient Register</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="form-label">Address:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">Phone Number[Please insert a unique phone number]:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your phone number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Create Account
            </button>
            <p>
                Already have an appointment? View status of the appointment &nbsp;
                <Link href="/TemporyLogin">View Appointment</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TemporySignUp;

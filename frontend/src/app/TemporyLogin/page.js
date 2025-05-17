"use client"; // ✅ This makes the file a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ uses "next/navigation"
import BackNavbar from "@/components/backNavBar";
import { temporyPatientLogin } from "@/services/temporyPatientService"; // ✅ Use login, not signUp
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Styles/loginForms.css";
import { toast } from "react-toastify";

const TemporyLogin = () => {
  const [formData, setFormData] = useState({
    phone: "",
  });

  const router = useRouter(); // Initialize the router

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitPatientData = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Basic phone validation
    if (!formData.phone || !/^0\d{9}$/.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    try {
      const response = await temporyPatientLogin(formData); // Call the service function

       if (!response) {
          throw new Error("No response from server");
       }

      if (response.success) {
        toast.success("Login successful");
        localStorage.setItem('temporarypatientData', JSON.stringify(response.data)); // save name and phone in local storage
        router.push("/temporyPatientQueue"); // Redirect on success
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "An error occurred while logging in");
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Check On Your Temporary Appointment</h2>
          <form onSubmit={submitPatientData}> 
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">Phone Number:</label>
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
              View Appointment
            </button>
            <p>
              Want to create a new appointment? &nbsp;
              <Link href="/TemporySignUp">Create Appointment</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TemporyLogin;

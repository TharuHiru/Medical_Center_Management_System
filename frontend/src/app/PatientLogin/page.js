"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import the Navbar component
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext
import { patientLogin } from "@/services/patientAuthService";

const PatientLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize the router
  const { login } = useAuth(); // Use login from AuthContext

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Call the patientLogin service with userName and password
      const response = await patientLogin(userName, password);
  
      if (response.success) {
        login("patient", userName, response.master_ID); // ✅ Passing master_ID
        console.log("Patient ID stored in context:", userName,response.master_ID); // ✅ Log the ID
        toast.success(`Login successful! Your Patient ID: ${userName}`); // ✅ Include ID in alert
        router.push("/patientDashboard/dashboard"); // Redirect to dashboard
      } else {
        toast.error("Login failed: " + response.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.err("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Patient Login</h2>
          <form className="temporyLoginForm" onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">User_Name:</label>
              <input
                type="text"
                className="form-control"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Login
            </button>   

            <p>
              Don&apos;t have an account? &nbsp;
              <Link href="/CreatePatientAccount">Create patient Account</Link>
            </p>     
        </form>
        </div>
      </section>
    </div>
  );
};

export default PatientLogin;

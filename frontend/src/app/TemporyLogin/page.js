"use client"; // ✅ This makes the file a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ uses "next/navigation"
import BackNavbar from "../../components/backNavBar";
import { temporyPatientLogin } from "../../services/temporyPatientService"; // ✅ Use login, not signUp
import Link from "next/link";

import "../../Styles/loginForms.css";

const TemporyLogin = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });

  const router = useRouter(); // Initialize the router

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitPatientData = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await temporyPatientLogin(formData); // Call the service function

      if (response.success) {
        alert("Login successful");
        router.push("/temporyPatientQueue"); // Redirect on success
      } else {
        alert(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "An error occurred while logging in");
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Temporary Patient Login</h2>
          <form onSubmit={submitPatientData}> {/* Correct form submission */}
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
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Login
            </button>
            <p>
              Don&apos;t have an account? &nbsp;
              <Link href="/TemporySignUp">Create patient Account</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TemporyLogin;

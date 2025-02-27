"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import the Navbar component
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Link from "next/link";

const PatientLogin = () => {
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize the router

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Handle login submission logic here (validation, API call, etc.)
    alert(`Logged in with User Name: ${UserName}`);

    // After successful login, navigate to the dashboard or next page
    router.push("/PatientDashboard");
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Patient Login</h2>
          <form className="temporyLoginForm" onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">User Name:</label>
              <input
                type="text"
                className="form-control"
                id="UserName"
                value={UserName}
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

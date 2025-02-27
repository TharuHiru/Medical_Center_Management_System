"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import the Navbar component
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const AccountInfo = () => {
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCopy, setPasswordCopy] = useState('');

  const router = useRouter(); // Initialize the router
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Handle login or account creation logic here (e.g., saving data to a database)
    alert(`Account created with Username: ${UserName}`);
    
    // Redirect to the success page
    router.push('/PatientLogin'); // Change this to your desired route
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Patient Account</h2>
          <form className="temporyLoginForm" onSubmit={handleLoginSubmit}>
            <p>You are almost there!</p>

            {/* Username Input */}
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

            {/* Password Input */}
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

            {/* Confirm Password Input */}
            <div className="mb-3">
              <label htmlFor="passwordCopy" className="form-label">Re-enter Password:</label>
              <input
                type="password"
                className="form-control"
                id="passwordCopy"
                value={passwordCopy}
                onChange={(e) => setPasswordCopy(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Create Account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AccountInfo;

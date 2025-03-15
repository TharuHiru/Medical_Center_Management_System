"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import the Navbar component
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { toast } from "react-toastify"; // Ensure you have toast for notifications
import { setNewPassword } from "../../services/patientAuthService"; // Import setPassword function

const AccountInfo = () => {
  const [password, setPassword] = useState('');
  const [passwordCopy, setPasswordCopy] = useState('');

  const router = useRouter(); // Initialize the router

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordCopy) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    try {
      // Call the setPassword function with the password
      const response = await setNewPassword(password);
      if (response.success) { // Check response.data.success, not response.status
        toast.success('Password set successfully!');
        router.push('/PatientLogin'); // Redirect to login page
      } else {
        toast.error('Failed to set password. Please try again.');
      }
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error('An error occurred while setting the password. Please try again.');
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Patient Account</h2>
          <form className="temporyLoginForm" onSubmit={handleLoginSubmit}>
            <p>You are almost there! Let&apos;s create a password.</p>

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

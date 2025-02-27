"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import the Navbar component
import '../../Styles/loginForms.css'; // Optional: Create your CSS for styling
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const TemporyLogin = () => {
  const [TemporyName, setName] = useState('');
  const [address, setAddress] = useState('');
  const [PhoneNumber, setPhone] = useState('');
  const router = useRouter(); // Initialize the router

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Handle login submission logic here (validation, API call, etc.)
    alert(`Logged in with Name: ${TemporyName}`);

    // After successful login, navigate to the next page (e.g., dashboard)
    router.push("/NextPage"); // Change this to your desired page
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Temporary Patient Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="TemporyName" className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                id="TemporyName"
                placeholder="Enter your name"
                value={TemporyName}
                onChange={(e) => setName(e.target.value)}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="PhoneNumber" className="form-label">Phone Number:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your phone number"
                id="PhoneNumber"
                value={PhoneNumber}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TemporyLogin;

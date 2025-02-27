"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use useRouter instead of useNavigate
import BackNavbar from "../../components/backNavBar"; // Navbar component
import "../../Styles/loginForms.css"; // Import styles

const AssistantLogin = () => {
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize Next.js router

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Handle login submission logic here (validation, API call, etc.)
    alert(`Logged in with Username: ${UserName}`);

    // After successful login, navigate to AssistantDashboard
    router.push("/AssistantDashboard");
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Assistant Login</h2>
          <form className="temporyLoginForm" onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">User Name:</label>
              <input
                type="text"
                className="form-control"
                id="userName"
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
          </form>
        </div>
      </section>
    </div>
  );
};

export default AssistantLogin;

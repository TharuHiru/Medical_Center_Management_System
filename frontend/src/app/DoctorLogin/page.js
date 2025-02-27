"use client"; 

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js routing
import BackNavbar from "../../components/backNavBar"; // Navbar component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doctorLogin } from "../../Services/authService";
import Link from "next/link"; // Next.js navigation

function DoctorLogin() {
  const router = useRouter(); // Use Next.js router
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await doctorLogin(UserName, password);

      if (data.success) {
        toast.success("Logged in successfully!");
        localStorage.setItem("doctorToken", data.token); // Save token for authentication

        // Redirect to Doctor Dashboard
        router.push(`/DoctorDashboard?username=${UserName}`);
      } else {
        toast.error(data.message || "Login failed! Invalid username or password");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4"> Doctor Login</h2>
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
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

            <p>
              Don&apos;t have an account? &nbsp;
              <Link href="/DoctorSignUp">Create an Account</Link>
            </p>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default DoctorLogin;

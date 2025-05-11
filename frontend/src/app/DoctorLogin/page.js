"use client"; 

import React, { useState } from "react"; //get state
import { useRouter } from "next/navigation"; // use routing
import BackNavbar from "@/components/backNavBar"; //import backnav bar to use
import { toast } from "react-toastify";// toast css
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link"; // Next.js navigation
import { useAuth } from ".@/context/AuthContext"; // Make sure this path is correct
import { doctorLogin } from "@/services/authService";

function DoctorLoginPage() {
  const router = useRouter(); // Use Next.js router
  const { login } = useAuth(); // ✅ Moved here

  // set the user name and password
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = await doctorLogin(UserName, password);
  
      if (data.success) {
        toast.success("Logged in successfully!");
        localStorage.setItem("doctorToken", data.token);
  
        // ✅ Send full user details to AuthContext
        login("doctor", data.user._id, null, data.user);
  
        console.log("Response Data: ", data);
  
        router.push(`/DoctorDashboard/Dashboard?firstname=${data.user.firstName}&lastname=${data.user.lastName}`);
      } else {
        console.error("Login Failed:", data.message);
        toast.error(data.message || "Login failed! Invalid username or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.message || "A network error occurred. Please check your connection.");
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
};

export default DoctorLoginPage;
  
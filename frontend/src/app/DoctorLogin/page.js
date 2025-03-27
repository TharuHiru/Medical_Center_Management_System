"use client"; 

import React, { useState } from "react"; //get state
import { useRouter } from "next/navigation"; // use routing

import BackNavbar from "../../components/backNavBar"; //import backnav bar to use

import { toast } from "react-toastify";// toast css
import "react-toastify/dist/ReactToastify.css";

import { doctorLogin } from "../../services/authService"; // import the login function from the service file
import Link from "next/link"; // Next.js navigation

function DoctorLogin() {
  const router = useRouter(); // Use Next.js router

  //set the user name when it changes
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // run the doctor login function using the user name and the password values
    try {
      const data = await doctorLogin(UserName, password); // API call and await for response
  
      if (data.success) {
        toast.success("Logged in successfully!");
        localStorage.setItem("doctorToken", data.token);

        router.push(`/DoctorDashboard/assistantManage?firstname=${data.user.firstName}&lastname=${data.user.lastName}`); // Redirect to the dashboard
      } 
      else {
        console.error("Login Failed:", data.message); // messgae for Debugging
        toast.error(data.message || "Login failed! Invalid username or password");
      }
    } 
    catch (error) {
      console.error("Login Error:", error); // Debugging
  
      // Handle backend errors from `doctorLogin`
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

export default DoctorLogin;
  
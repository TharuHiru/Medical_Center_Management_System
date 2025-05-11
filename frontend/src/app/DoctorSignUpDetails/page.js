"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook

import BackNavbar from '@/components/backNavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerDoctorStep2 } from '@/services/authService';
import { useSearchParams } from "next/navigation"; // Import useSearchParams

const DoctorSignUpDetails = () => {
  const router = useRouter(); // Initialize the router
  const searchParams = useSearchParams(); // Initialize searchParams
  const userNameFromURL = searchParams.get("username"); // Get username from URL

  const [userName, setUserName] = useState(userNameFromURL|| '');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const secret_Key = process.env.NEXT_PUBLIC_SECRET_KEY;
    
    if (secretKey !== secret_Key) {
      toast.error("Invalid Secret Key");
    } 
    else if (password !== rePassword) {
      toast.error("Passwords do not match");
    } 
    else {
      try {
        const formData = {
          email: userName,
          username: userName,
          password,
          secretKey: secret_Key,
        };
        
        const response = await registerDoctorStep2(formData);
        if (response.success) {
          toast.success("Account Created Successfully");
          router.push('/DoctorLogin'); // Redirect without useRouter
        } else {
          toast.error(response.message || "Something went wrong.");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      }
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Doctor Account</h2>
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">User Name:</label>
              <input type="text"
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
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rePassword" className="form-label">Re Enter Password:</label>
              <input
                type="password"
                className="form-control"
                id="register-re-password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="secretKey" className="form-label">Secret Key:</label>
              <input
                type="password"
                className="form-control"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
              />
            </div>

            <p>Already have an account? &nbsp;
              <a href="/DoctorLogin">Log in</a></p>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Create Account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default DoctorSignUpDetails;

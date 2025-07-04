"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import BackNavbar from "@/components/backNavBar"; // Navbar component
import "@/Styles/loginForms.css"; // Import styles
import { assistLogin } from "@/services/authService"; // import the login function from the service file
import { toast } from "react-toastify"; // Import Toastify for toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { useAuth } from "@/context/AuthContext";

const AssistantLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 
  const { login } = useAuth(); // ✅ Moved here
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await assistLogin(email, password);
  
      if (data.success) {
        localStorage.setItem("AssistToken", data.token);
        login("assistant", data.user.id, null, {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        });
  
        if (data.firstLogin == 1) {
          router.push("/changeAssistantPassword");
        } else {
          toast.success("Logged in successfully!");
          router.push("/AssistantDashboard/dashboard");
        }
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
          <h2 className="text-center mb-4">Assistant Login</h2>
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">User Name:</label>
              <input
                type="email"
                className="form-control"
                id="userName"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

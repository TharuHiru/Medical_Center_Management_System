"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import '../../Styles/loginForms.css'; // Import your CSS styles
import { verifyCode } from "../../services/patientAuthService"; // Import verifyCode function

import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const CodeForm = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const router = useRouter();

  // Handle input change
  const handleInputChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    console.log('Entered code:', fullCode);
  
    try {
      const response = await verifyCode(fullCode);
      console.log("Verification response:", response);
  
      if (response.success) { // ✅ No need for response.data.success
        router.push('/AccountInfo'); 
      } else {
        toast.error("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error.response?.data?.error || error.message);
      toast.error("Verification failed. Please try again later.");
    }
  };
  

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Enter the Code</h2>

            <div className="d-flex justify-content-center mb-3">
              {/* 6 Input fields for the code */}
              {code.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(e, index)}
                  maxLength="1"
                  className="form-control mx-1 text-center"
                  style={{ width: '50px', height: '50px', fontSize: '20px' }}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-100 loginBtn">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CodeForm;

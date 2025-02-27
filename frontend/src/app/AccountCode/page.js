"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import '../../Styles/loginForms.css'; // Import your CSS styles

const CodeForm = () => {
  // State to store the values for each input box
  const [code, setCode] = useState(['', '', '', '', '']);
  const router = useRouter(); // Initialize the router

  // Handle input change for each box
  const handleInputChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value; // Update the value of the corresponding box
    setCode(newCode);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Join the code and perform any action (like submitting it to a server)
    const fullCode = code.join('');
    console.log('Entered code:', fullCode);

    // After form submission, navigate to the /AccountInfo page
    router.push('/AccountInfo'); // Change this to your desired route
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Enter the Code</h2>
            <div className="d-flex justify-content-center mb-3">
              {/* 5 Input fields for the code */}
              {code.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(e, index)}
                  maxLength="1" // Limit input to 1 character
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

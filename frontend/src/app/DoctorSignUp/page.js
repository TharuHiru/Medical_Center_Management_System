"use client";

import React, { useState } from "react";
import BackNavbar from "../../components/backNavBar"; // Import Navbar
import { useRouter } from "next/navigation"; // Import useRouter hook
import { registerDoctorStep1 } from "../../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorSignUp = () => {
  const router = useRouter(); // Initialize the router

  // State to manage form fields dynamically
  const [formData, setFormData] = useState({
    title: "",
    FirstName: "",
    LastName: "",
    Speciality: "",
    email: "",
  });

  // State for validation
  const [errors, setErrors] = useState({});

  // Validation Rules
  const validationRules = {
    title: /^.{1,}$/, // Ensures at least one character is present
    FirstName: /^[a-zA-Z\s]+$/, // Allows only letters & spaces
    LastName: /^[a-zA-Z\s]+$/,
    Speciality: /^[a-zA-Z\s]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate input
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationRules[name].test(value) ? "" : `Invalid ${name}`,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are valid
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      } else if (!validationRules[key].test(formData[key])) {
        newErrors[key] = `Invalid ${key}`;
      }
    });

    // If there are errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors before submitting.");
      return;
    }

    try {
      const result = await registerDoctorStep1(formData);
      if (result.success) {
        toast.success("Step 1 complete. Proceed to Step 2.");
        router.push("/DoctorSignUpDetails"); // Change this to your desired route
      } else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <BackNavbar /> {/* Insert navigation bar */}
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Doctor Account</h2>
          <form className="temporyLoginForm" onSubmit={handleSubmit}>
            {/** Fields **/}
            {Object.keys(formData).map((field) => (
              <div key={field} className="mb-3">
                <label htmlFor={field} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}

            <p>
              Already have an account? &nbsp;
              <a href="/DoctorLogin">Log in</a>
            </p>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Register
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default DoctorSignUp;

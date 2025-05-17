"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import BackNavbar from "@/components/backNavBar";
import { registerDoctorStep1 } from "@/services/authService";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorSignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    FirstName: "",
    LastName: "",
    Speciality: "",
    email: "",
  });

  //form validations
  const validationRules = {
    title: /^(Mr|Mrs|Miss)$/,   // only allow Mr, Mrs, Miss
    FirstName: /^[a-zA-Z\s]+$/, // only allow letters and spaces
    LastName: /^[a-zA-Z\s]+$/,  // only allow letters and spaces
    Speciality: /^[a-zA-Z\s]+$/, // only allow letters and spaces
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // valid email format
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {}; // create an errors array
    Object.keys(formData).forEach((key) => {
      // if there is no data , 
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;

      // if the data is not valid
      } else if (!validationRules[key].test(formData[key])) {
        newErrors[key] = `Invalid ${key}`;
      }
    });
    // Show error messages for each invalid field
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return;
    }

    // Calll the backend API
    try {
      const result = await registerDoctorStep1(formData);
      if (result.success) {
        toast.success("Step 1 complete. Proceed to Step 2.");
        router.push(`/DoctorSignUpDetails?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Doctor Account</h2>
          <form className="temporyLoginForm" onSubmit={handleSubmit}>

            {/* Title Combo Box */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title:</label>
              <select
                name="title"
                id="title"
                className="form-select"
                value={formData.title}
                onChange={handleChange}
                required
              >
                <option value="">Select title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
              </select>
            </div>

            {/* Other Input Fields */}
            {["FirstName", "LastName", "Speciality", "email"].map((field) => (
              <div key={field} className="mb-3">
                <label htmlFor={field} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  className="form-control"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <p>
              Already have an account? &nbsp;
              <a href="/DoctorLogin">Log in</a>
            </p>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Next {'>'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default DoctorSignUp;

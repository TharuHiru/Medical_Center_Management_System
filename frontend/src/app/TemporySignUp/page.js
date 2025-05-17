"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BackNavbar from "@/components/backNavBar";
import { temporyPatientSignUp } from "@/services/temporyPatientService";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/Styles/loginForms.css";

const TemporySignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Name validation (letters, spaces, apostrophes)
    if (!formData.name || !/^[A-Za-z\s'-]+$/.test(formData.name)) {
      toast.error("Invalid name format");
    }

    // Phone validation (10 digits starting with 0)
    if (!formData.phone || !/^0\d{9}$/.test(formData.phone)) {
      toast.error("Invalid phone number format");
      return false;
    }

    // Address validation (max 50 chars)
    if (!formData.address || formData.address.length > 50) {
      toast.error("Address must be less than 50 characters");
      return false;
    }

    return true;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating temporary appointment...");

    try {
      const response = await temporyPatientSignUp(formData);
      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success("Temporary patienta added successfully!");
        router.push("/TemporyLogin");
      } else {
        toast.error(response.message || "Failed to create temporary appointment");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error creating temporary appointment:", error);
      toast.error(error.response?.data?.message || "An error occurred while creating the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Temporary Patient Appointment</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="form-label">Address:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your address (max 50 characters)"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">Phone Number:</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter your phone number (0712345678)"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button 
               type="submit"  className="btn btn-primary w-100 loginBtn" >
               Go to appointments
            </button>
            <p className="mt-3 text-center">
              Already have an appointment?{" "}
              <Link href="/TemporyLogin" className="text-primary">
                View Appointment
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TemporySignUp;
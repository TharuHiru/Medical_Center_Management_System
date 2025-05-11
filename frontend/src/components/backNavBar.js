"use client"; // Ensure this runs on the client side

import React from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import Image from "next/image"; // Optimize images
import Link from "next/link"; // Use Next.js routing 
import "../Styles/loginForms.css";

// Component for the Navbar
function BackNavbar() {
  const router = useRouter(); // Use Next.js router

  const handleBackClick = () => {
    router.back(); // Navigate back in Next.js
  };

  return (
    <nav className="navbar navbar-expand-lg backNavBar" style={{ backgroundColor: "rgba(255, 255, 255, 0.586)"}}>
      <div className="container" >
        <Link className="navbar-brand" href="/">
          <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="me-1" />
          <span className="fw-bold">Poly Clinic</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <button onClick={handleBackClick} className="btn btn-primary ms-3 backbtn">
            Back
          </button>
        </div>
      </div>
    </nav>
  );
}

export default BackNavbar;

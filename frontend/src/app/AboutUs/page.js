"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackNavbar from '../../components/backNavBar'; // Import the Navbar component
import '../../Styles/aboutUs.css'; // Import your CSS styles

const AboutUs = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg welcomeNavBar fixed-top" style={{ zIndex: 1000 }}>
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="me-2" />
          <span className="fw-bold">Poly Clinic</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/" className="nav-link active fw-bold">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/AboutUs" className="nav-link text-dark">About us</Link>
            </li>
          </ul>
          <button className="btn btn-primary ms-2 rounded-pill px-4 loginBtn" onClick={() => router.push('/whoAreYou')}>
            Login
          </button>
        </div>
      </nav>
      <div>
      <section className="container aboutUsContainer">
        <div className="col-md-12">
        <br />
        <br />
        <br />
        <br />
          <h2 className="text-center mb-4">About Us</h2>
          <p className="aboutUsText">
            Welcome to our Medical Center Management System. Our mission is to provide seamless and efficient healthcare management solutions to medical centers and their patients. We strive to enhance the patient experience by offering a user-friendly platform that simplifies appointment scheduling, patient records management, and inventory control.
          </p>
          <p className="aboutUsText">
            Our team is dedicated to continuously improving our system to meet the evolving needs of healthcare providers and patients. We believe in leveraging technology to create a more connected and efficient healthcare ecosystem.
          </p>
          <p className="aboutUsText">
            Thank you for choosing our Medical Center Management System. We are committed to supporting you in delivering the best possible care to your patients.
          </p>
        </div>
      </section>
    </div>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg welcomeNavBar fixed-top" style={{ zIndex: 1000 }}>
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="me-2" />
          <span className="fw-bold">Poly Clinic</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/" className="nav-link active fw-bold">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/AboutUs" className="nav-link text-dark">About us</Link>
            </li>
          </ul>
          <button className="btn btn-primary ms-2 rounded-pill px-4 loginBtn" onClick={() => router.push('/whoAreYou')}>
            Login
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AboutUs;
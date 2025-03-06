"use client"; // ✅ This makes the file a client component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // ✅ Correct import
import '../../Styles/welcomePage.css';
import '../../Styles/loginForms.css';

// Component for the Welcome Page (Without Navbar)
function WelcomePage() {
  const router = useRouter();

  // Inline CSS for background image
  const backgroundStyle = {
    backgroundImage: `url('/welcome-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100vw',
    
  };

  const handleQueueClick = () => {
    router.push('/Page1'); // Navigate to "/page1"
  };

  return (
    <>
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

      {/* Background Section */}
      <div style={backgroundStyle}>
        <section className="container backContainer">
          <div className="row">
            <div className="col-md-12">
              <h1 className="welcomePageTopic">YOUR HEALTHCARE <br />PROVIDER</h1>
              <p className="text-muted">
                Polyclinic provides progressive, and affordable healthcare, accessible online for everyone.
              </p>
              <button className="btn btn-primary welcomebtn rounded-pill px-4" onClick={handleQueueClick}>
                Get a queue number <br /> <span className="btn-sin-text">අංකයක් ලබා ගන්න</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default WelcomePage;

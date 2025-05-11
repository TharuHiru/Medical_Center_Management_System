"use client"; 

import React from 'react';
import Link from 'next/link'; // Next.js routing
import { FaUser, FaUserMd, FaUserNurse } from "react-icons/fa"; // Import icons
import BackNavbar from '@/components/backNavBar';
import '@/Styles/whoAreYou.css';

// Component for the registered or not page
function WhoAreYou() {
  return (
    <>
      <BackNavbar />
      <div>
        <section>
        <div className="row btnRow">
          {/* Patient Login */}
          <div className="col-md-3 d-flex justify-content-center">
            <Link
              href="/PatientLogin"
              className="btnWhoAreYou d-flex flex-column justify-content-center align-items-center text-decoration-none"
              aria-label="Patient Login"
            >
              <FaUser size={40} className="mb-2" />
              Patient Login
            </Link>
          </div>

          {/* Assistant Login */}
          <div className="col-md-3 d-flex justify-content-center">
            <Link
              href="/AssistantLogin"
              className="btnWhoAreYou d-flex flex-column justify-content-center align-items-center text-decoration-none"
              aria-label="Assistant Login"
            >
              <FaUserNurse size={40} className="mb-2" />
              Assistant Login
            </Link>
          </div>

          {/* Doctor Login */}
          <div className="col-md-3 d-flex justify-content-center">
            <Link
              href="/DoctorLogin"
              className="btnWhoAreYou d-flex flex-column justify-content-center align-items-center text-decoration-none"
              aria-label="Doctor Login"
            >
              <FaUserMd size={40} className="mb-2" />
              Doctor Login
            </Link>
          </div>
        </div>
        </section>
      </div>
    </>
  );
}

export default WhoAreYou;

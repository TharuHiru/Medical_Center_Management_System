"use client"; 

import React from 'react';
import Link from 'next/link'; // Next.js routing
import { FaUser, FaUserMd, FaUserNurse } from "react-icons/fa"; // Import icons
import BackNavbar from '../../components/backNavBar';
import '../../Styles/welcomePage.css';

// Component for the registered or not page
function WhoAreYou() {
  return (
    <>
      <BackNavbar />
      <div>
        <section>
          <div className="row btnRow">
            {/* Patient Button */}
            <div className="col-md-3 d-flex justify-content-center">
              <Link href="/PatientLogin">
                <button className="btn btn-primary btnWhoAreYou" aria-label="Patient Login">
                  <FaUser size={40} className="mb-2" /> <br />
                  Patient Login
                </button>
              </Link>
            </div>

            {/* Assistant Button */}
            <div className="col-md-3 d-flex justify-content-center">
              <Link href="/AssistantLogin">
                <button className="btn btn-primary btnWhoAreYou" aria-label="Assistant Login">
                  <FaUserNurse size={40} className="mb-2" /><br />
                  Assistant Login
                </button>
              </Link>
            </div>

            {/* Doctor Button */}
            <div className="col-md-3 d-flex justify-content-center">
              <Link href="/DoctorLogin">
                <button className="btn btn-primary btnWhoAreYou" aria-label="Doctor Login">
                  <FaUserMd size={40} className="mb-2" /> <br />
                  Doctor Login
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default WhoAreYou;

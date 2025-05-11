"use client"; // ✅ This makes the file a client component
import React, { use } from 'react';
import { useRouter } from 'next/navigation'; // Import useNavigate
import BackNavbar from '@/components/backNavBar';
import '@/Styles/loginForms.css';
import '@/Styles/welcomePage.css';


function Page1() {
    const router = useRouter(); // Initialize useNavigate hook

    // Function to handle Yes button click
    const handleYesClick = () => {
       router.push('/PatientLogin'); // Navigate to the "/yes" route
    };

    // Function to handle No button click
    const handleNoClick = () => {
        router.push('/TemporyLogin'); // Navigate to the "/TemporyLogin" route
    };

    return (
        <>
            <BackNavbar />
            <section className="container backFormContainer d-flex flex-column justify-content-center text-center">
            <div className='topicText'>
                    <h1>Have you registered in the medical center?</h1>
                </div>

                <div className="row d-flex justify-content-center">
                    <div className="col-md-5 d-flex justify-content-center gap-3 ">
                        <button className="btn btn-primary btnWhoAreYou" onClick={handleYesClick}>
                            Yes, I am
                        </button>
                    </div>

                    <div className="col-md-5 d-flex justify-content-center">
                        <button className="btn btn-primary btnWhoAreYou" onClick={handleNoClick}>
                            No, I am Not
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Page1
"use client";

import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/Styles/patientDashboard.css';
import Image from "next/image"; 
import ProtectedRoute from '@/components/protectedRoute';
import "@/Styles/sideNavBar.css";
import Swal from 'sweetalert2';
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const router = useRouter();
  const { logout } = useAuth();
  
  // Handle navigation functions
  const navigateToAppointments = () => {
    router.push('/patientDashboard/appoinments');
  };
  
  const navigateToProfile = () => {
    router.push('/patientDashboard/profile');
  };

  const handleLogout = () => {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout',
            background: '#203a43',
            color: 'white',
          }).then((result) => {
            if (result.isConfirmed) {
              logout();
              router.push('/PatientLogin');
            }
          });
        };
  
  return (
    <ProtectedRoute>
    <div className="min-vh-100 bg-light">
      {/* Full-width Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark topNav">
        <div className="container-fluid px-4 py-2">
          <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="me-1" />
          <a className="navbar-brand fs-3 fw-bold" href="#">Patient Portal</a>
          <button className="logout-button" style={{ width: "100px" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-5 px-4">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Welcome to Poly Clinic Dashboard</h1>
          <p className="lead text-muted">Manage your healthcare journey with ease</p>
        </div>

        {/* Cards Container - Stacked vertically */}
        <div className="dashboard-cards-container">
          {/* Appointments Card - Horizontal with Background */}
          <div 
            onClick={navigateToAppointments}
            className="dashboard-card appointments-card animate__animated animate__fadeIn"
          >
            <div className="row g-0">
              <div className="col-md-4">
                <div className="card-bg-image appointment-bg"></div>
              </div>
              <div className="col-md-8">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle me-3">
                      <i className="bi bi-calendar-check fs-2 text-primary"></i>
                    </div>
                    <h3 className="card-title fw-bold mb-0">Book Appointments</h3>
                  </div>
                  <p className="card-text fs-5">
                    Schedule new appointments or manage your existing bookings with our easy-to-use interface. View your upcoming visits and get reminders.
                  </p>
                  <div className="text-end">
                    <button className="btn btn-outline-primary">
                      Go to Appointments <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Card - Horizontal with Background */}
          <div 
            onClick={navigateToProfile}
            className="dashboard-card profile-card animate__animated animate__fadeIn"
          >
            <div className="row g-0">
              <div className="col-md-4">
                <div className="card-bg-image profile-bg"></div>
              </div>
              <div className="col-md-8">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle me-3">
                      <i className="bi bi-person fs-2 text-success"></i>
                    </div>
                    <h3 className="card-title fw-bold mb-0">View Profile</h3>
                  </div>
                  <p className="card-text fs-5">
                    Access and update your personal information, medical history, prescriptions, and manage your healthcare preferences.
                  </p>
                  <div className="text-end">
                    <button className="btn btn-outline-success">
                      Go to Profile <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
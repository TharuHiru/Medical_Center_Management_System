"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import "@/Styles/dashboardCard.css";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AssistNavBar from "@/components/assistantSideBar";
import { getDashboardStats } from "@/services/dashboardAPI"; // Import your service

function AssistantDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userName } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Logout logic
  const logout = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <AssistNavBar onLogout={logout} />
        <div className="content-area container mt-4">
          <div className="text-center py-5">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <AssistNavBar onLogout={logout} />
        <div className="content-area container mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <AssistNavBar onLogout={logout} />
      <div className="content-area container mt-4">
        <div className="welcome-card card custom-float-card shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="image-col">
            <Image
              src="/dashboard.jpg"
              alt="Welcome Illustration"
              width={400}
              height={250}
              className="img-fluid"
              style={{ borderRadius: "1rem" }}
            />
          </div>
          <div className="text-col text-center text-md-start">
            <h1 className="fw-bold mb-2 card-text">Welcome, {userName} 👋</h1>
            <p className="mb-0 text-muted">Wishing you a productive day ahead!</p>
          </div>
        </div>
        
        {/* Cards Row */}
        <div className="row g-4">
          {/* Card 1 - Total Patients */}
          <div className="col-md-3">
            <div className="card total-doctors-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid green", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Patients</h5>
                  <h2 className="fw-bold text-success">{stats?.totalPatients || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card 2 - Total Doctors */}
          <div className="col-md-3">
            <div className="card total-doctors-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid blue", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Doctors</h5>
                  <h2 className="fw-bold text-primary">{stats?.totalDoctors || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card 3 - Today's Appointments */}
          <div className="col-md-3">
            <div className="card total-appointments-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid #ffc107", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Today&apos;s Appointments</h5>
                  <h2 className="fw-bold text-warning">{stats?.todaysAppointments || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card 4 - Total Appointments */}
          <div className="col-md-3">
            <div className="card total-prescriptions-card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid red", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Appointments</h5>
                  <h2 className="fw-bold text-danger">{stats?.totalAppointments || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Cards */}
          <div className="col-md-3">
            <div className="card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid purple", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Available Medicines</h5>
                  <h2 className="fw-bold" style={{ color: "purple" }}>{stats?.availableMedicines || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid orange", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Out of Stock</h5>
                  <h2 className="fw-bold" style={{ color: "orange" }}>{stats?.outOfStockMedicines || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid teal", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Unbilled Prescriptions</h5>
                  <h2 className="fw-bold" style={{ color: "teal" }}>{stats?.unbilledPrescriptions || 0}</h2>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex">
                <div style={{ borderLeft: "6px solid pink", padding: "10px", height: "100px" }}></div>
                <div>
                  <h5 className="text-uppercase fw-semibold mb-3 text-muted">Total Payments</h5>
                  <h2 className="fw-bold" style={{ color: "pink" }}>${stats?.totalPayments || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;
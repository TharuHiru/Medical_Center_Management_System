"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import "@/Styles/dashboardCard.css";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AssistNavBar from "@/components/assistantSideBar";
import { getDashboardStats } from "@/services/dashboardAPI";
import 'bootstrap-icons/font/bootstrap-icons.css';

function AssistantDashboard() {
  const router = useRouter();
  const { userName } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const logout = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-container bg-light">
        <AssistNavBar onLogout={logout} />
        <div className="content-area container py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <div className="spinner-border text-primary me-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="fs-5 text-secondary">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container bg-light">
        <AssistNavBar onLogout={logout} />
        <div className="content-area container py-5">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        </div>
      </div>
    );
  }

  // Define stat cards data
  const statCards = [
    { title: "Total Patients", value: stats?.totalPatients || 0, color: "success", icon: "bi-people" },
    { title: "Total Doctors", value: stats?.totalDoctors || 0, color: "primary", icon: "bi-heart-pulse" },
    { title: "Today's Appointments", value: stats?.todaysAppointments || 0, color: "warning", icon: "bi-calendar-check" },
    { title: "Total Appointments", value: stats?.totalAppointments || 0, color: "danger", icon: "bi-calendar-week" },
    { title: "Available Medicines", value: stats?.availableMedicines || 0, color: "purple", icon: "bi-capsule" },
    { title: "Out of Stock", value: stats?.outOfStockMedicines || 0, color: "orange", icon: "bi-x-circle" },
    { title: "Unbilled Prescriptions", value: stats?.unbilledPrescriptions || 0, color: "info", icon: "bi-file-earmark-medical" },
    { title: "Total Payments", value: `$${stats?.totalPayments || 0}`, color: "secondary", icon: "bi-cash-stack" },
  ];

  return (
    <div className="dashboard-container bg-light">
      <AssistNavBar onLogout={logout} />
      
      <div className="content-area container py-4">
        {/* Welcome Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-4 p-4">
              <Image
                src="/dashboard.jpg"
                alt="Welcome Illustration"
                width={400}
                height={250}
                className="img-fluid rounded-3"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </div>
            <div className="col-md-8 d-flex align-items-center">
              <div className="card-body py-4">
                <h1 className="display-6 fw-bold mb-2">Welcome, {userName} 👋</h1>
                <p className="text-muted fs-5">Wishing you a productive day ahead!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="row g-4">
          {statCards.map((card, index) => {
            const textColorClass = card.color === "purple" ? "text-purple" : 
                                  card.color === "orange" ? "text-orange" : `text-${card.color}`;
            
            return (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 position-relative overflow-hidden">
                  <div className={`card-top-border bg-${card.color === "purple" ? "purple" : 
                                                        card.color === "orange" ? "orange" : card.color}`}></div>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className={`stat-icon-container bg-${card.color === "purple" ? "purple-light" : 
                                                               card.color === "orange" ? "orange-light" : 
                                                               card.color + "-light"} me-3`}>
                        <i className={`bi ${card.icon} ${textColorClass}`}></i>
                      </div>
                      <h5 className="text-uppercase fw-semibold mb-0 text-muted small">{card.title}</h5>
                    </div>
                    <h2 className={`fw-bold ${textColorClass}`}>{card.value}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;
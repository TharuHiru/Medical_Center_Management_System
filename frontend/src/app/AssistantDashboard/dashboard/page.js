"use client";

import React, { useEffect, useState } from "react";
import dashboardAPI from "@/services/dashboardAPI";

function AssistantDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getDashboardStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;

  if (!stats) return <p>Failed to load dashboard stats.</p>;

  const cardData = [
    { title: "Total Patients", value: stats.totalPatients, color: "success" },
    { title: "Today's Appointments", value: stats.todaysAppointments, color: "info" },
    { title: "Total Appointments", value: stats.totalAppointments, color: "primary" },
    { title: "Available Medicines", value: stats.availableMedicines, color: "success" },
    { title: "Out of Stock Medicines", value: stats.outOfStockMedicines, color: "danger" },
    { title: "Total Doctors", value: stats.totalDoctors, color: "primary" },
    { title: "Unbilled Prescriptions", value: stats.unbilledPrescriptions, color: "warning" },
    { title: "Total Payments Collected", value: stats.totalPayments, color: "success" },
    { title: "Temporary Patients", value: stats.temporaryPatients, color: "secondary" },
    { title: "Medicine Brands Available", value: stats.medicineBrands, color: "info" }
  ];

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Assistant Dashboard</h1>
      <div className="row g-4">
        {cardData.map(({ title, value, color }, index) => (
          <div key={index} className="col-md-4 col-lg-3">
            <div className={`card text-white bg-${color} rounded-4 p-4`}>
              <h5 className="card-title text-uppercase">{title}</h5>
              <h2>{value !== null ? value : "-"}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssistantDashboard;

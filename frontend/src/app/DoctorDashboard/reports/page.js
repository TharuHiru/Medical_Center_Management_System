"use client";

import ReportViewer from '@/components/reportViewer';
import DoctorSidebar from '@/components/doctorSideBar';
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import ProtectedRoute from '@/components/protectedRoute';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
    <div className="dashboard-container">
    <DoctorSidebar />
    <div className="content-area container mt-4">
      <div className="content-area">
        <h1>Medical Center Reports</h1>
        <ReportViewer />
      </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
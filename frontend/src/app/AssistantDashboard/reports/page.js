"use client";

import ReportViewer from '@/components/reportViewer';
import AssistNavBar from "@/components/assistantSideBar";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import ProtectedRoute from '@/components/protectedRoute';

export default function ReportsPage() {
  // Dummy logout function for AssistNavBar
  const logout = () => {
    console.log("Logged out");
  };

  return (
    <ProtectedRoute>
    <div className="dashboard-container">
      <AssistNavBar onLogout={logout} />

      <div className="content-area">
        <h1>Medical Center Reports</h1>
        <ReportViewer />
      </div>
    </div>
    </ProtectedRoute>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {changeAssistantPassword} from "@/services/authService"

const AssistantChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("AssistToken");

      const res = await changeAssistantPassword(newPassword, token);

      toast.success("Password changed successfully!");
      router.push("/AssistantLogin");
    } catch (error) {
      console.error("Error:", error);
      const message = error.response?.data?.message || "An error occurred.";
      toast.error(message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Update Password</button>
      </form>
    </div>
  );
};

export default AssistantChangePassword;

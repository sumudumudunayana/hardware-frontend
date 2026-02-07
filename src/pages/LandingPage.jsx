import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/LandingPageStyles.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay" />
      <div className="content">
        <h1 className="title">Hardware Management System</h1>
        <p className="subtitle">
          Manage inventory, bookings, customers, and hardware workflow all in
          one place.
        </p>
        <button className="start-btn" onClick={() => navigate("/OptionPage")}>
          Get Started
        </button>
      </div>
    </div>
  );
}

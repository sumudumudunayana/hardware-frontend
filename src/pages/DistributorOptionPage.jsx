import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/DistributorOptionPageStyles.css";

export default function DistributorOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="distributor-container">
      <div className="distributor-overlay"></div>

      <div className="distributor-card">
        <h1 className="distributor-title">Distributor Management</h1>

        <div className="distributor-grid">
          <div
            className="distributor-box"
            onClick={() => navigate("/AddDistributorPage")}
          >
            <h2>Add Distributor</h2>
            <p>Add and register new distributor details.</p>
          </div>

          {/* Manage Distributor */}
          <div
            className="distributor-box"
            onClick={() => navigate("/ManageDistributorPage")}
          >
            <h2>Manage Distributors</h2>
            <p>View, update, and delete distributor records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

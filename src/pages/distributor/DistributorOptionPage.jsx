import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/distributor/DistributorOptionPageStyles.css";

export default function DistributorOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="distributor-container">
      <div className="distributor-overlay"></div>
      <div className="distributor-card">
        <h1 className="distributor-title">Supplier Management</h1>
        <div className="distributor-grid">
          <div
            className="distributor-box"
            onClick={() => navigate("/AddDistributorPage")}
          >
            <h2>Add Supplier</h2>
            <p>Add and register new supplier details.</p>
          </div>
          <div
            className="distributor-box"
            onClick={() => navigate("/ManageDistributorPage")}
          >
            <h2>Manage suppliers</h2>
            <p>View, update, and delete supplier records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

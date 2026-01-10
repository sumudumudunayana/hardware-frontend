import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/SupplierOptionPageStyles.css";

export default function SupplierOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="supplier-container">
      <div className="supplier-overlay"></div>
      <div className="supplier-card">
        <h1 className="supplier-title">Supplier Management</h1>

        <div className="supplier-grid">
          <div
            className="supplier-box"
            onClick={() => navigate("/CompanyOptionPage")}
          >
            <h2>Manage Company</h2>
            <p>Add, view and update company details.</p>
          </div>

          <div
            className="supplier-box"
            onClick={() => navigate("/CategoryOptionPage")}
          >
            <h2>Manage Category</h2>
            <p>Organize and maintain item categories.</p>
          </div>

          <div
            className="supplier-box"
            onClick={() => navigate("/DistributorOptionPage")}
          >
            <h2>Manage Distributor</h2>
            <p>Register and manage all Distributors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/OptionPageStyles.css";

export default function OptionPage() {
  const navigate = useNavigate();

  return (
    <div className="options-container">
      <div className="options-overlay"></div>

      <div className="options-card">
        <h1 className="options-title">Management Dashboard</h1>

        <div className="options-grid">

          <div
            className="option-box"
            onClick={() => navigate("/ItemOptionPage")}
          >
            <h2>Item Management</h2>
            <p>Add, view, update and manage all inventory items.</p>
          </div>

          <div
            className="option-box"
            onClick={() => navigate("/CustomerPage")}
          >
            <h2>Customer Management</h2>
            <p>Manage customer details, records, and interactions.</p>
          </div>

          <div
            className="option-box"
            onClick={() => navigate("/SalesPage")}
          >
            <h2>Sales Management</h2>
            <p>Handle sales, billing, and transaction records.</p>
          </div>

          <div
            className="option-box"
            onClick={() => navigate("/SupplierOptionPage")}
          >
            <h2>Supplier Management</h2>
            <p>Track suppliers, purchase orders, and deliveries.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CustomerOptionPageStyles.css";

export default function CustomerOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="customer-container">
      <div className="customer-overlay"></div>

      <div className="customer-card">
        <h1 className="customer-title">Customer Management</h1>

        <div className="customer-grid">
          <div
            className="customer-box"
            onClick={() => navigate("/AddCustomerPage")}>
            <h2>Add Customer</h2>
            <p>Register new customers into the system.</p>
          </div>
          <div
            className="customer-box"
            onClick={() => navigate("/ManageCustomerPage")}
          >
            <h2>Manage Customer</h2>
            <p>Update customer information or records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

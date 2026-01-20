import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CompanyOptionPageStyles.css";

export default function CompanyOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="company-container">
      <div className="company-overlay"></div>
      <div className="company-card">
        <h1 className="company-title">Company Management</h1>
        <div className="company-grid">
          <div
            className="company-box"
            onClick={() => navigate("/AddCompanyPage")}>
            <h2>Add Company</h2>
            <p>Add and register new company details.</p>
          </div>
          <div
            className="company-box"
            onClick={() => navigate("/ManageCompanyPage")}
          >
            <h2>Manage Companies</h2>
            <p>View, update, and delete company records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/SalesOptionPageStyles.css";

export default function SalesOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="sales-container">
      <div className="sales-overlay"></div>

      <div className="sales-card">
        <h1 className="sales-title">Sales Management</h1>

        <div className="sales-grid">
          <div className="sales-box" onClick={() => navigate("/AddSalesPage")}>
            <h2>Add Sales</h2>
            <p>Create a new sales transaction in the system.</p>
          </div>

          <div
            className="sales-box"
            onClick={() => navigate("/ManageSalesPage")}
          >
            <h2>Manage Sales</h2>
            <p>View, update or delete sales records.</p>
          </div>

          <div
            className="sales-box"
            onClick={() => navigate("/SalesReportPage")}
          >
            <h2>Sales Reports</h2>
            <p>Analyze sales performance and revenue data.</p>
          </div>

          <div className="sales-box" onClick={() => navigate("/InvoicePage")}>
            <h2>Invoices</h2>
            <p>Generate and manage customer invoices.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

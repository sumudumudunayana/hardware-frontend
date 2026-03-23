import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/common/OptionPageStyles.css";

export default function OptionPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear session
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="option-page-shell">
      <div className="option-page-grid-bg"></div>
      <div className="option-page-glow option-page-glow-left"></div>
      <div className="option-page-glow option-page-glow-right"></div>

      <div className="option-page-panel">

        {/* TOP BAR */}
        <div className="option-page-topbar">
          <button className="option-logout-btn" onClick={handleLogout}>
            ⎋ Logout
          </button>
        </div>

        {/* HEADER */}
        <div className="option-page-header">
          <div className="option-page-header-text">
            <span className="option-page-badge">CONTROL CENTER</span>
            <h1 className="option-page-title">Management Dashboard</h1>
            <p className="option-page-subtitle">
              Access inventory, customers, suppliers, sales, stock movement, and
              promotions from one unified hardware operations hub.
            </p>
          </div>

          <div className="option-page-summary">
            <div className="option-page-metric-card">
              <span className="option-page-metric-label">Modules</span>
              <h3>06</h3>
              <p>Core business units</p>
            </div>

            <div className="option-page-metric-card">
              <span className="option-page-metric-label">System Mode</span>
              <h3>Live</h3>
              <p>Operational workspace</p>
            </div>
          </div>
        </div>

        {/* MODULE GRID */}
        <div className="option-page-module-grid">

          <div className="option-page-module-card" onClick={() => navigate("/products")}>
            <div className="option-page-module-top">
              <span className="option-page-module-icon">📦</span>
              <span className="option-page-module-status">Inventory Active</span>
            </div>
            <h2>Product Management</h2>
            <p>Add, view, update, and organize all hardware inventory items.</p>
            <span className="option-page-module-link">Open Module →</span>
          </div>

          <div className="option-page-module-card" onClick={() => navigate("/customers")}>
            <div className="option-page-module-top">
              <span className="option-page-module-icon">👥</span>
              <span className="option-page-module-status">Customer Records</span>
            </div>
            <h2>Customer Management</h2>
            <p>Manage customer profiles, account history, and interactions.</p>
            <span className="option-page-module-link">Open Module →</span>
          </div>

          <div className="option-page-module-card" onClick={() => navigate("/sales")}>
            <div className="option-page-module-top">
              <span className="option-page-module-icon">🧾</span>
              <span className="option-page-module-status">Sales Monitoring</span>
            </div>
            <h2>Order Management</h2>
            <p>Handle sales flow, billing operations, and transaction records.</p>
            <span className="option-page-module-link">Open Module →</span>
          </div>

          <div className="option-page-module-card" onClick={() => navigate("/suppliers")}>
            <div className="option-page-module-top">
              <span className="option-page-module-icon">🚚</span>
              <span className="option-page-module-status">Supply Network</span>
            </div>
            <h2>Supplier Management</h2>
            <p>Track suppliers, purchase activity, and delivery operations.</p>
            <span className="option-page-module-link">Open Module →</span>
          </div>

          <div className="option-page-module-card" onClick={() => navigate("/stock")}>
            <div className="option-page-module-top">
              <span className="option-page-module-icon">📊</span>
              <span className="option-page-module-status">Stock Intelligence</span>
            </div>
            <h2>Stock Management</h2>
            <p>Monitor stock levels, item movement, and restocking actions.</p>
            <span className="option-page-module-link">Open Module →</span>
          </div>

          <div className="option-page-module-card" onClick={() => navigate("/promotions")}>
            <div className="option-page-module-top">
              <span className="option-page-module-icon">🏷️</span>
              <span className="option-page-module-status">Campaign Tools</span>
            </div>
            <h2>Promotion Management</h2>
            <p>Create discount campaigns, offers, and promotional actions.</p>
            <span className="option-page-module-link">Open Module →</span>
          </div>

        </div>
      </div>
    </div>
  );
}
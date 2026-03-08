import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/common/LandingPageStyles.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-bg-grid"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <header className="topbar">
        <div className="logo-box">
          <div className="logo-icon">H</div>
          <span className="logo-text">HardwareMS</span>
        </div>

        <div className="topbar-right">
          <button className="ghost-btn" onClick={() => navigate("/OptionPage")}>
            Dashboard
          </button>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-left">
          <span className="tagline">SMART HARDWARE OPERATIONS</span>

          <h1 className="title">
            Future-Ready
            <span> Hardware Management </span>
            Platform
          </h1>

          <p className="subtitle">
            Manage inventory, customers, suppliers, sales, and stock intelligence
            through one unified digital control center.
          </p>

          <div className="hero-buttons">
            <button
              className="start-btn"
              onClick={() => navigate("/OptionPage")}
            >
              Launch Dashboard
            </button>

            <button className="secondary-btn">View Analytics</button>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <h3>12.4K+</h3>
              <p>Total Items Tracked</p>
            </div>
            <div className="stat-card">
              <h3>248</h3>
              <p>Orders Processed Today</p>
            </div>
            <div className="stat-card">
              <h3>94%</h3>
              <p>Stock Accuracy</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>System Overview</p>
            </div>

            <div className="preview-cards">
              <div className="mini-card">
                <span className="mini-label">Inventory Health</span>
                <h2>92%</h2>
                <p>Stable stock performance</p>
              </div>

              <div className="mini-card warning">
                <span className="mini-label">Low Stock Alerts</span>
                <h2>18</h2>
                <p>Immediate restock needed</p>
              </div>

              <div className="mini-card">
                <span className="mini-label">Active Suppliers</span>
                <h2>36</h2>
                <p>Connected across regions</p>
              </div>

              <div className="mini-card accent">
                <span className="mini-label">AI Forecast</span>
                <h2>+14%</h2>
                <p>Demand rise next week</p>
              </div>
            </div>

            <div className="preview-bottom">
              <div className="activity-card">
                <h4>Recent Activity</h4>
                <ul>
                  <li>New stock added: Cement Bags</li>
                  <li>Supplier delivery confirmed</li>
                  <li>Paint category sales increased</li>
                </ul>
              </div>

              <div className="chart-card">
                <h4>Stock Flow</h4>
                <div className="fake-chart">
                  <span className="bar bar1"></span>
                  <span className="bar bar2"></span>
                  <span className="bar bar3"></span>
                  <span className="bar bar4"></span>
                  <span className="bar bar5"></span>
                  <span className="bar bar6"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
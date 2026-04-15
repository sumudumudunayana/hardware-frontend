import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/sales/SalesModuleLayoutStyles.css";

export default function SalesModuleLayout() {
  const navigate = useNavigate();

  return (
    <div className="sales-module-shell">
      {/* Sidebar */}
      <aside className="sales-module-sidebar">
        <div className="sales-module-top">
          <button
            className="sales-back-btn"
            onClick={() => navigate("/OptionPage")}
          >
            ← Back
          </button>

          <span className="sales-badge">SALES MODULE</span>
          <h2 className="sales-title">Order Management</h2>
        </div>

        <nav className="sales-nav">
          <NavLink
            to="/sales"
            end
            className={({ isActive }) =>
              isActive ? "sales-link active" : "sales-link"}
          >
            Overview
          </NavLink>

          <NavLink
            to="/sales/sales-forecast"
            end
            className={({ isActive }) =>
              isActive ? "sales-link active" : "sales-link"}
          >
            Sales Forecast
          </NavLink>

          {/* SECTION */}
          <span className="sales-section-title">ORDER MANAGEMENT</span>

          <NavLink
            to="/sales/add"
            className={({ isActive }) =>
              isActive ? "sales-link active" : "sales-link"
            }
          >
            Add Order
          </NavLink>

          <NavLink
            to="/sales/manage"
            className={({ isActive }) =>
              isActive ? "sales-link active" : "sales-link"
            }
          >
            Manage Orders
          </NavLink>

          {/* SECTION */}
          <span className="sales-section-title">ANALYTICS</span>

          <NavLink
            to="/sales/reports"
            className={({ isActive }) =>
              isActive ? "sales-link active" : "sales-link"
            }
          >
            Sales Reports
          </NavLink>

          <NavLink
            to="/sales/invoices"
            className={({ isActive }) =>
              isActive ? "sales-link active" : "sales-link"
            }
          >
            Invoices
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="sales-module-content">
        <Outlet />
      </main>
    </div>
  );
}

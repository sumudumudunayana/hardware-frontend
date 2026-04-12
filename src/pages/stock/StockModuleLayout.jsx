import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/stock/StockModuleLayoutStyles.css";

export default function StockModuleLayout() {
  const navigate = useNavigate();

  return (
    <div className="stock-module-shell">
      {/* Sidebar */}
      <aside className="stock-module-sidebar">
        <div className="stock-module-top">
          <button
            className="stock-back-btn"
            onClick={() => navigate("/OptionPage")}
          >
            ← Back
          </button>

          <span className="stock-badge">STOCK MODULE</span>
          <h2 className="stock-title">Stock Management</h2>
        </div>

        <nav className="stock-nav">
          {/* Overview */}
          <NavLink
            to="/stock"
            end
            className={({ isActive }) =>
              isActive ? "stock-link active" : "stock-link"
            }
          >
            Overview
          </NavLink>

          {/* STOCK MANAGEMENT */}
          <span className="stock-section-title">STOCK MANAGEMENT</span>

          <NavLink
            to="/stock/add"
            className={({ isActive }) =>
              isActive ? "stock-link active" : "stock-link"
            }
          >
            Add Stock
          </NavLink>

          <NavLink
            to="/stock/manage"
            className={({ isActive }) =>
              isActive ? "stock-link active" : "stock-link"
            }
          >
            Manage Stock
          </NavLink>

          {/* ANALYTICS */}
          <span className="stock-section-title">ANALYTICS</span>

          <NavLink
            to="/stock/low"
            className={({ isActive }) =>
              isActive ? "stock-link active" : "stock-link"
            }
          >
            Low Stock Alerts
          </NavLink>

          <NavLink
            to="/stock/reports"
            className={({ isActive }) =>
              isActive ? "stock-link active" : "stock-link"
            }
          >
            Stock Reports
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="stock-module-content">
        <Outlet />
      </main>
    </div>
  );
}

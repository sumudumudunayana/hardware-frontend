import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/customer/CustomerModuleLayoutStyles.css";

export default function CustomerModuleLayout() {
  const navigate = useNavigate();

  return (
    <div className="customer-module-shell">
      {/* Sidebar */}
      <aside className="customer-module-sidebar">
        <div className="customer-module-top">
          <button
            className="customer-back-btn"
            onClick={() => navigate("/OptionPage")}
          >
            ← Back
          </button>

          <span className="customer-badge">CUSTOMER MODULE</span>
          <h2>Customers</h2>
        </div>

        <nav className="customer-nav">
          <NavLink
            to="/customers"
            end
            className={({ isActive }) =>
              isActive ? "customer-link active" : "customer-link"
            }
          >
            Overview
          </NavLink>

          {/* SECTION 1 */}
          <span className="customer-module-section-title">
            CUSTOMER MANAGEMENT
          </span>

          <NavLink
            to="/customers/add"
            className={({ isActive }) =>
              isActive ? "customer-link active" : "customer-link"
            }
          >
            Add Customer
          </NavLink>

          <NavLink
            to="/customers/manage"
            className={({ isActive }) =>
              isActive ? "customer-link active" : "customer-link"
            }
          >
            Manage Customers
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="customer-module-content">
        <Outlet />
      </main>
    </div>
  );
}

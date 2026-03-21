import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/distributor/DistributorModuleLayoutStyles.css";

export default function DistributorModuleLayout() {
  const navigate = useNavigate();

  return (
    <div className="distributor-module-shell">
      {/* Sidebar */}
      <aside className="distributor-module-sidebar">
        <div className="distributor-module-top">
          <button
            className="distributor-back-btn"
            onClick={() => navigate("/OptionPage")}
          >
            ← Back
          </button>

          <span className="distributor-badge">SUPPLIER MODULE</span>
          <h2 className="distributor-title">Suppliers</h2>
        </div>

        <nav className="distributor-nav">
          {/* Overview */}
          <NavLink
            to="/suppliers"
            end
            className={({ isActive }) =>
              isActive ? "distributor-link active" : "distributor-link"
            }
          >
            Overview
          </NavLink>

          {/* SUPPLIER SECTION */}
          <span className="distributor-section-title">SUPPLIER MANAGEMENT</span>

          <NavLink
            to="/suppliers/add"
            className={({ isActive }) =>
              isActive ? "distributor-link active" : "distributor-link"
            }
          >
            Add Supplier
          </NavLink>

          <NavLink
            to="/suppliers/manage"
            className={({ isActive }) =>
              isActive ? "distributor-link active" : "distributor-link"
            }
          >
            Manage Suppliers
          </NavLink>

          {/* COMPANY SECTION */}
          <span className="distributor-section-title">COMPANY MANAGEMENT</span>

          <NavLink
            to="/suppliers/company/add"
            className={({ isActive }) =>
              isActive ? "distributor-link active" : "distributor-link"
            }
          >
            Add Company
          </NavLink>

          <NavLink
            to="/suppliers/company/manage"
            className={({ isActive }) =>
              isActive ? "distributor-link active" : "distributor-link"
            }
          >
            Manage Companies
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="distributor-module-content">
        <Outlet />
      </main>
    </div>
  );
}

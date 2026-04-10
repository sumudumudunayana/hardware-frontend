import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/promotion/PromotionModuleLayoutStyles.css";

export default function PromotionModuleLayout() {
  const navigate = useNavigate();

  return (
    <div className="promotion-module-shell">
      {/* Sidebar */}
      <aside className="promotion-module-sidebar">
        <div className="promotion-module-top">
          <button
            className="promotion-back-btn"
            onClick={() => navigate("/OptionPage")}
          >
            ← Back
          </button>

          <span className="promotion-badge">PROMOTION MODULE</span>
          <h2 className="promotion-title">Promotions</h2>
        </div>

        <nav className="promotion-nav">
          {/* Overview */}
          <NavLink
            to="/promotions"
            end
            className={({ isActive }) =>
              isActive ? "promotion-link active" : "promotion-link"
            }
          >
            Overview
          </NavLink>

          {/* PROMOTION MANAGEMENT */}
          <span className="promotion-section-title">PROMOTION MANAGEMENT</span>

          <NavLink
            to="/promotions/add"
            className={({ isActive }) =>
              isActive ? "promotion-link active" : "promotion-link"
            }
          >
            Add Promotion
          </NavLink>

          <NavLink
            to="/promotions/view"
            className={({ isActive }) =>
              isActive ? "promotion-link active" : "promotion-link"
            }
          >
            View Promotions
          </NavLink>

          <NavLink
            to="/promotions/manage"
            className={({ isActive }) =>
              isActive ? "promotion-link active" : "promotion-link"
            }
          >
            Manage Promotions
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="promotion-module-content">
        <Outlet />
      </main>
    </div>
  );
}

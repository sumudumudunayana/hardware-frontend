import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/item/ProductModuleLayoutStyles.css";

export default function ProductModuleLayout() {
  const navigate = useNavigate();

  return (
    <div className="product-module-shell">
      {/* Sidebar */}
      <aside className="product-module-sidebar">
        <div className="product-module-sidebar-top">
          <button
            className="product-module-back-btn"
            onClick={() => navigate("/OptionPage")}
          >
            ← Back
          </button>

          <span className="product-module-badge">PRODUCT MODULE</span>
          <h2 className="product-module-title">Inventory Control</h2>
        </div>

        <nav className="product-module-nav">
          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              isActive
                ? "product-module-nav-link product-module-nav-link-active"
                : "product-module-nav-link"
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/products/add-item"
            className={({ isActive }) =>
              isActive
                ? "product-module-nav-link product-module-nav-link-active"
                : "product-module-nav-link"
            }
          >
            Add Item
          </NavLink>

          <NavLink
            to="/products/view-items"
            className={({ isActive }) =>
              isActive
                ? "product-module-nav-link product-module-nav-link-active"
                : "product-module-nav-link"
            }
          >
            View Items
          </NavLink>

          <NavLink
            to="/products/update-item"
            className={({ isActive }) =>
              isActive
                ? "product-module-nav-link product-module-nav-link-active"
                : "product-module-nav-link"
            }
          >
            Update Item
          </NavLink>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="product-module-content">
        <Outlet />
      </main>
    </div>
  );
}

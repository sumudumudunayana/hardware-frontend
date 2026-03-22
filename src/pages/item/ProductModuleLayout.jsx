import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/item/ProductModuleLayoutStyles.css";

export default function ProductModuleLayout() {
  const navigate = useNavigate();

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "product-module-nav-link product-module-nav-link-active"
      : "product-module-nav-link";

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

          {/* Overview */}
          <NavLink to="/products" end className={getLinkClass}>
            Overview
          </NavLink>

          {/* Product Section */}
          <span className="product-module-section-title">
            Product Management
          </span>

          <NavLink to="/products/add-item" className={getLinkClass}>
            Add Item
          </NavLink>

          <NavLink to="/products/view-items" className={getLinkClass}>
            View Items
          </NavLink>

          <NavLink to="/products/update-item" className={getLinkClass}>
            Update Item
          </NavLink>

          {/* Category Section */}
          <span className="product-module-section-title">
            Category Management
          </span>

          <NavLink to="/products/add-category" className={getLinkClass}>
            Add Category
          </NavLink>

          <NavLink to="/products/manage-category" className={getLinkClass}>
            Manage Category
          </NavLink>

        </nav>
      </aside>

      {/* Content */}
      <main className="product-module-content">
        <Outlet />
      </main>
    </div>
  );
}
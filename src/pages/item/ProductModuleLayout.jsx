import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function ProductModuleLayout() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    padding: "10px",
    textDecoration: "none",
    color: isActive ? "#facc15" : "white",
    background: isActive ? "#334155" : "transparent",
    borderRadius: "8px"
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "250px",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        <button onClick={() => navigate("/OptionPage")}>
          ← Back
        </button>

        <h2>Products</h2>

        <NavLink to="/products" end style={linkStyle}>
          Overview
        </NavLink>

        <NavLink to="/products/add-item" style={linkStyle}>
          Add Item
        </NavLink>

        <NavLink to="/products/view-items" style={linkStyle}>
          View Items
        </NavLink>

        <NavLink to="/products/update-item" style={linkStyle}>
          Update Item
        </NavLink>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}
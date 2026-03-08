import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/item/ItemOptionPageStyles.css";

export default function ItemOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="item-option-page-shell">
      <div className="item-option-page-grid-bg"></div>
      <div className="item-option-page-glow item-option-page-glow-left"></div>
      <div className="item-option-page-glow item-option-page-glow-right"></div>

      <div className="item-option-page-panel">
        <div className="item-option-page-header">
          <div className="item-option-page-header-text">
            <span className="item-option-page-badge">PRODUCT CONTROL</span>
            <h1 className="item-option-page-title">Product Management</h1>
            <p className="item-option-page-subtitle">
              Manage your hardware inventory with dedicated tools for adding,
              viewing, and updating product records.
            </p>
          </div>

          <div className="item-option-page-summary">
            <div className="item-option-page-metric-card">
              <span className="item-option-page-metric-label">Actions</span>
              <h3>03</h3>
              <p>Inventory workflows</p>
            </div>

            <div className="item-option-page-metric-card">
              <span className="item-option-page-metric-label">Module</span>
              <h3>Live</h3>
              <p>Product workspace</p>
            </div>
          </div>
        </div>

        <div className="item-option-page-grid">
          <div
            className="item-option-page-card"
            onClick={() => navigate("/AddItemPage")}
          >
            <div className="item-option-page-card-top">
              <span className="item-option-page-card-icon">➕</span>
              <span className="item-option-page-card-status">Create Record</span>
            </div>
            <h2>Add Item</h2>
            <p>Create and register new inventory items for the system.</p>
            <span className="item-option-page-card-link">Open Action →</span>
          </div>

          <div
            className="item-option-page-card"
            onClick={() => navigate("/ViewItemPage")}
          >
            <div className="item-option-page-card-top">
              <span className="item-option-page-card-icon">📦</span>
              <span className="item-option-page-card-status">Inventory View</span>
            </div>
            <h2>View Items</h2>
            <p>View all products with item details, stock, and category data.</p>
            <span className="item-option-page-card-link">Open Action →</span>
          </div>

          <div
            className="item-option-page-card"
            onClick={() => navigate("/UpdateItemPage")}
          >
            <div className="item-option-page-card-top">
              <span className="item-option-page-card-icon">✏️</span>
              <span className="item-option-page-card-status">Modify Data</span>
            </div>
            <h2>Update Item</h2>
            <p>Modify item details, prices, quantities, and related records.</p>
            <span className="item-option-page-card-link">Open Action →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
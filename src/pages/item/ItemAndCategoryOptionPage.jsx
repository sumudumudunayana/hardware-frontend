import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/item/ItemAndCategoryOptionPageStyles.css";

export default function ItemAndCategoryOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="item-category-option-page-shell">
      <div className="item-category-option-page-grid-bg"></div>
      <div className="item-category-option-page-glow item-category-option-page-glow-left"></div>
      <div className="item-category-option-page-glow item-category-option-page-glow-right"></div>

      <div className="item-category-option-page-panel">
        <div className="item-category-option-page-header">
          <div className="item-category-option-page-header-text">
            <span className="item-category-option-page-badge">
              PRODUCT STRUCTURE
            </span>
            <h1 className="item-category-option-page-title">
              Product &amp; Category Management
            </h1>
            <p className="item-category-option-page-subtitle">
              Manage both inventory products and category organization from one
              structured control module.
            </p>
          </div>

          <div className="item-category-option-page-summary">
            <div className="item-category-option-page-metric-card">
              <span className="item-category-option-page-metric-label">
                Sections
              </span>
              <h3>02</h3>
              <p>Core management areas</p>
            </div>

            <div className="item-category-option-page-metric-card">
              <span className="item-category-option-page-metric-label">
                Module State
              </span>
              <h3>Live</h3>
              <p>Ready for action</p>
            </div>
          </div>
        </div>

        <div className="item-category-option-page-grid">
          <div
            className="item-category-option-page-card"
            onClick={() => navigate("/ItemOptionPage")}
          >
            <div className="item-category-option-page-card-top">
              <span className="item-category-option-page-card-icon">📦</span>
              <span className="item-category-option-page-card-status">
                Inventory Tools
              </span>
            </div>

            <h2>Product Management</h2>
            <p>Add, view, and update inventory items across the system.</p>
            <span className="item-category-option-page-card-link">
              Open Section →
            </span>
          </div>

          <div
            className="item-category-option-page-card"
            onClick={() => navigate("/CategoryOptionPage")}
          >
            <div className="item-category-option-page-card-top">
              <span className="item-category-option-page-card-icon">🗂️</span>
              <span className="item-category-option-page-card-status">
                Structure Control
              </span>
            </div>

            <h2>Category Management</h2>
            <p>Create, organize, and manage product categories efficiently.</p>
            <span className="item-category-option-page-card-link">
              Open Section →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
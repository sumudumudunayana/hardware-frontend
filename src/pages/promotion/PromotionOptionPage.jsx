import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/PromotionOptionPageStyles.css";

export default function PromotionOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="promotion-container">
      <div className="promotion-overlay"></div>

      <div className="promotion-card">
        <h1 className="promotion-title">Promotion Management</h1>

        <div className="promotion-grid">
          <div
            className="promotion-box"
            onClick={() => navigate("/AddPromotionPage")}
          >
            <h2>Add Promotion</h2>
            <p>Create new promotional offers and discounts.</p>
          </div>

          <div
            className="promotion-box"
            onClick={() => navigate("/ViewPromotionPage")}
          >
            <h2>View Promotions</h2>
            <p>View all active and expired promotions.</p>
          </div>

          <div
            className="promotion-box"
            onClick={() => navigate("/ManagePromotionPage")}
          >
            <h2>Manage Promotions</h2>
            <p>Update, activate, deactivate, or delete promotions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
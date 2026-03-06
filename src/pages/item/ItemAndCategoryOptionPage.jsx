import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/item/ItemAndCategoryOptionPageStyles.css";

export default function ItemAndCategoryOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="ic-container">
      <div className="ic-overlay"></div>

      <div className="ic-card">
        <h1 className="ic-title">Product & Category Management</h1>

        <div className="ic-grid">
          {/* ITEM MANAGEMENT */}

          <div className="ic-box" onClick={() => navigate("/ItemOptionPage")}>
            <h2>Product Management</h2>
            <p>
              Add, view, and update inventory items.
            </p>
          </div>

          {/* CATEGORY MANAGEMENT */}

          <div
            className="ic-box"
            onClick={() => navigate("/CategoryOptionPage")}
          >
            <h2>Category Management</h2>
            <p>
              Create and manage product categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

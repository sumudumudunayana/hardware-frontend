import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ItemOptionPageStyles.css";

export default function ItemOptionPage() {
  const navigate = useNavigate();
  return (
    <div className="item-container">
      <div className="item-overlay"></div>
      <div className="item-card">
        <h1 className="item-title">Item Management</h1>

        <div className="item-grid">
          <div className="item-box" onClick={() => navigate("/AddItemPage")}>
            <h2>Add Item</h2>
            <p>Create and register new inventory items.</p>
          </div>

          <div className="item-box" onClick={() => navigate("/ViewItemPage")}>
            <h2>View Items</h2>
            <p>View all items with full details and stock info.</p>
          </div>

          <div className="item-box" onClick={() => navigate("/UpdateItemPage")}>
            <h2>Update Item</h2>
            <p>Modify item data, prices, categories, etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

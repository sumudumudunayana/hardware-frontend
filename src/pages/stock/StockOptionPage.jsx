import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/stock/StockOptionPageStyles.css";

export default function StockOptionPage() {

  const navigate = useNavigate();

  return (
    <div className="stock-container">

      <div className="stock-overlay"></div>

      <div className="stock-card">

        <h1 className="stock-title">Stock Management</h1>

        <div className="stock-grid">

          <div
            className="stock-box"
            onClick={() => navigate("/AddStockPage")}
          >
            <h2>Add Stock</h2>
            <p>Add new inventory or increase item quantities.</p>
          </div>

          <div
            className="stock-box"
            onClick={() => navigate("/ManageStockPage")}
          >
            <h2>Manage Stock</h2>
            <p>View and update stock levels for all items.</p>
          </div>

          <div
            className="stock-box"
            onClick={() => navigate("/LowStockPage")}
          >
            <h2>Low Stock Alerts</h2>
            <p>Monitor items that are running low in inventory.</p>
          </div>

          <div
            className="stock-box"
            onClick={() => navigate("/StockReportPage")}
          >
            <h2>Stock Reports</h2>
            <p>Analyze inventory levels and stock movements.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/stock/LowStockAlertPageStyles.css";

export default function LowStockAlertPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW STATE
  const [statusFilter, setStatusFilter] = useState("ALL");

  const LOW_STOCK_LIMIT = 10;
  const CRITICAL_LIMIT = 5;

  const loadStocks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stocks");
      setStocks(res.data);
    } catch {
      toast.error("Failed to load stock alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  // STATUS HELPER
  const getStatus = (qty) => {
    if (qty === 0) return "OUT";
    if (qty <= CRITICAL_LIMIT) return "CRITICAL";
    return "LOW";
  };

  // FILTER + SORT LOGIC
  const alertStocks = useMemo(() => {
    let filtered = stocks.filter((stock) => stock.quantity <= LOW_STOCK_LIMIT);

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (stock) => getStatus(stock.quantity) === statusFilter
      );
    }

    // SORT BY SEVERITY
    const priority = {
      OUT: 1,
      CRITICAL: 2,
      LOW: 3,
    };

    return filtered.sort(
      (a, b) => priority[getStatus(a.quantity)] - priority[getStatus(b.quantity)]
    );
  }, [stocks, statusFilter]);

  // SUMMARY
  const summary = useMemo(() => {
    return {
      low: stocks.filter(
        (s) => s.quantity > CRITICAL_LIMIT && s.quantity <= LOW_STOCK_LIMIT
      ).length,

      critical: stocks.filter(
        (s) => s.quantity > 0 && s.quantity <= CRITICAL_LIMIT
      ).length,

      outOfStock: stocks.filter((s) => s.quantity === 0).length,

      reorderToday: stocks.filter((s) => s.quantity <= LOW_STOCK_LIMIT).length,
    };
  }, [stocks]);

  // STATUS STYLE
  const getStatusStyle = (qty) => {
    if (qty === 0)
      return { text: "Out of Stock", className: "status-out" };

    if (qty <= CRITICAL_LIMIT)
      return { text: "Critical", className: "status-critical" };

    return { text: "Low", className: "status-low" };
  };

  return (
    <div className="lsa-wrapper">
      <div className="lsa-card">
        {/* HEADER */}
        <div className="lsa-header">
          <span className="lsa-badge">ALERTS</span>
          <h1>Low Stock Alerts</h1>
        </div>

        {/* FILTER BUTTONS */}
<div className="lsa-filter-bar">
  <button
    className={`lsa-filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
    onClick={() => setStatusFilter("ALL")}
  >
    All
  </button>

  <button
    className={`lsa-filter-btn ${statusFilter === "OUT" ? "active" : ""}`}
    onClick={() => setStatusFilter("OUT")}
  >
    Out of Stock
  </button>

  <button
    className={`lsa-filter-btn ${statusFilter === "CRITICAL" ? "active" : ""}`}
    onClick={() => setStatusFilter("CRITICAL")}
  >
    Critical
  </button>

  <button
    className={`lsa-filter-btn ${statusFilter === "LOW" ? "active" : ""}`}
    onClick={() => setStatusFilter("LOW")}
  >
    Low
  </button>
</div>

        {/* SUMMARY */}
        <div className="lsa-summary-grid">
          <div className="lsa-summary-box">
            <h3>{summary.low}</h3>
            <p>Low Stock</p>
          </div>

          <div className="lsa-summary-box">
            <h3>{summary.critical}</h3>
            <p>Critical Items</p>
          </div>

          <div className="lsa-summary-box">
            <h3>{summary.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>

          <div className="lsa-summary-box">
            <h3>{summary.reorderToday}</h3>
            <p>Reorder Today</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="lsa-table-wrapper">
          <table className="lsa-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Company</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Last Update</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="lsa-empty">
                    Loading...
                  </td>
                </tr>
              ) : alertStocks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="lsa-empty">
                    No matching items
                  </td>
                </tr>
              ) : (
                alertStocks.map((stock) => {
                  const status = getStatusStyle(stock.quantity);

                  return (
                    <tr key={stock._id}>
                      <td>{stock.stockId}</td>
                      <td>{stock.itemId?.itemName}</td>
                      <td>{stock.itemId?.itemCategory}</td>
                      <td>{stock.itemId?.itemCompany}</td>
                      <td>{stock.quantity}</td>

                      <td>
                        <span className={`lsa-status ${status.className}`}>
                          {status.text}
                        </span>
                      </td>

                      <td>
                        {stock.updatedAt
                          ? new Date(stock.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
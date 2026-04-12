import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/stock/LowStockAlertPageStyles.css";

export default function LowStockAlertPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const alertStocks = useMemo(() => {
    return stocks.filter((stock) => stock.quantity <= LOW_STOCK_LIMIT);
  }, [stocks]);

  const summary = useMemo(() => {
    return {
      low: stocks.filter(
        (s) => s.quantity > CRITICAL_LIMIT && s.quantity <= LOW_STOCK_LIMIT,
      ).length,

      critical: stocks.filter(
        (s) => s.quantity > 0 && s.quantity <= CRITICAL_LIMIT,
      ).length,

      outOfStock: stocks.filter((s) => s.quantity === 0).length,

      reorderToday: stocks.filter((s) => s.quantity <= LOW_STOCK_LIMIT).length,
    };
  }, [stocks]);

  const getStatus = (qty) => {
    if (qty === 0) {
      return { text: "Out of Stock", className: "status-out" };
    }

    if (qty <= CRITICAL_LIMIT) {
      return { text: "Critical", className: "status-critical" };
    }

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

        {/* SUMMARY CARDS */}
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
                    No low stock alerts
                  </td>
                </tr>
              ) : (
                alertStocks.map((stock) => {
                  const status = getStatus(stock.quantity);

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

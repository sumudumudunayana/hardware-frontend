import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/stock/StockOverviewPageStyles.css";

export default function StockOverviewPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stock data");
    } finally {
      setLoading(false);
    }
  };

  // total quantity of all stock
  const totalItemsInStock = useMemo(() => {
    return stocks.reduce((sum, stock) => sum + Number(stock.quantity || 0), 0);
  }, [stocks]);

  // stock records with qty > 0
  const availableStock = useMemo(() => {
    return stocks.filter((stock) => Number(stock.quantity) > 0).length;
  }, [stocks]);

  // low stock items (<= 5)
  const lowStockItems = useMemo(() => {
    return stocks.filter(
      (stock) =>
        Number(stock.quantity) > 0 &&
        Number(stock.quantity) <= 5
    ).length;
  }, [stocks]);

  // recent added stock today
  const recentStockAdded = useMemo(() => {
    const today = new Date().toDateString();

    return stocks
      .filter(
        (stock) =>
          stock.createdAt &&
          new Date(stock.createdAt).toDateString() === today
      )
      .reduce((sum, stock) => sum + Number(stock.quantity || 0), 0);
  }, [stocks]);

  // highest qty item
  const fastMovingItem = useMemo(() => {
    if (!stocks.length) return "No data";

    const sorted = [...stocks].sort(
      (a, b) => Number(b.quantity) - Number(a.quantity)
    );

    return sorted[0]?.itemId?.itemName || "No data";
  }, [stocks]);

  // latest updated date
  const lastUpdated = useMemo(() => {
    if (!stocks.length) return "No data";

    const sorted = [...stocks].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return sorted[0]?.updatedAt
      ? new Date(sorted[0].updatedAt).toLocaleDateString()
      : "No data";
  }, [stocks]);

  if (loading) {
    return <div className="stk-wrapper">Loading stock data...</div>;
  }

  return (
    <div className="stk-wrapper">
      {/* HEADER */}
      <div className="stk-header">
        <span className="stk-badge">OVERVIEW</span>
        <h1>Stock Workspace</h1>
        <p>
          Monitor inventory levels, stock movements, and availability.
        </p>
      </div>

      {/* STATS */}
      <div className="stk-cards">
        <div className="stk-card">
          <div className="stk-card-top">
            <span className="stk-icon">📦</span>
            <span className="stk-label">Total Items in Stock</span>
          </div>
          <h2>{totalItemsInStock.toLocaleString()}</h2>
        </div>

        <div className="stk-card success">
          <div className="stk-card-top">
            <span className="stk-icon">✅</span>
            <span className="stk-label">Available Stock</span>
          </div>
          <h2>{availableStock}</h2>
        </div>

        <div className="stk-card warning">
          <div className="stk-card-top">
            <span className="stk-icon">⚠️</span>
            <span className="stk-label">Low Stock Items</span>
          </div>
          <h2>{lowStockItems}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="stk-insights">
        <h3>Stock Insights</h3>

        <div className="stk-insight-grid">
          <div className="stk-insight-box">
            <p>📥 Recent Stock Added</p>
            <span>+{recentStockAdded} Items</span>
          </div>

          <div className="stk-insight-box">
            <p>🔥 Highest Stock Item</p>
            <span>{fastMovingItem}</span>
          </div>

          <div className="stk-insight-box">
            <p>🕒 Last Updated</p>
            <span>{lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/item/ProductOverviewPageStyles.css";

export default function ProductOverviewPage() {
  const [totalItems, setTotalItems] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [stockGrowth, setStockGrowth] = useState(0);
  const [topCategory, setTopCategory] = useState("-");
  const [lastUpdate, setLastUpdate] = useState("-");

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      const [itemsRes, categoriesRes, stocksRes] = await Promise.all([
        api.get("/items"),
        api.get("/categories"),
        api.get("/stocks"),
      ]);

      const items = itemsRes.data;
      const categories = categoriesRes.data;
      const stocks = stocksRes.data;

      // Total items
      setTotalItems(items.length);

      // Total categories
      setTotalCategories(categories.length);

      // Low stock count (less than 10)
      const lowStockItems = stocks.filter((stock) => stock.quantity < 10);
      setLowStock(lowStockItems.length);

      // Total stock quantity
      const totalQty = stocks.reduce(
        (sum, stock) => sum + Number(stock.quantity || 0),
        0,
      );
      setStockGrowth(totalQty);

      // Top category
      const categoryCount = {};

      items.forEach((item) => {
        const category = item.itemCategory || "Unknown";

        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      let top = "-";
      let max = 0;

      for (const category in categoryCount) {
        if (categoryCount[category] > max) {
          max = categoryCount[category];
          top = category;
        }
      }

      setTopCategory(top);

      // Last updated stock
      if (stocks.length > 0) {
        const latestStock = stocks.reduce((latest, current) =>
          new Date(current.updatedAt) > new Date(latest.updatedAt)
            ? current
            : latest,
        );

        setLastUpdate(new Date(latestStock.updatedAt).toLocaleDateString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pov-wrapper">
      {/* HEADER */}
      <div className="pov-header">
        <span className="pov-badge">OVERVIEW</span>
        <h1>Product Workspace</h1>
        <p>Manage items, categories, pricing, and inventory efficiently.</p>
      </div>

      {/* STATS */}
      <div className="pov-cards">
        <div className="pov-card">
          <div className="pov-card-top">
            <span className="pov-icon">📦</span>
            <span className="pov-label">Total Items</span>
          </div>
          <h2>{totalItems}</h2>
        </div>

        <div className="pov-card warning">
          <div className="pov-card-top">
            <span className="pov-icon">⚠️</span>
            <span className="pov-label">Low Stock</span>
          </div>
          <h2>{lowStock}</h2>
        </div>

        <div className="pov-card success">
          <div className="pov-card-top">
            <span className="pov-icon">📊</span>
            <span className="pov-label">Categories</span>
          </div>
          <h2>{totalCategories}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="pov-insights">
        <h3>Quick Insights</h3>

        <div className="pov-insight-grid">
          <div className="pov-insight-box">
            <p>📈 Total Stock Qty</p>
            <span>{stockGrowth}</span>
          </div>

          <div className="pov-insight-box">
            <p>🔥 Top Category</p>
            <span>{topCategory}</span>
          </div>

          <div className="pov-insight-box">
            <p>🕒 Last Update</p>
            <span>{lastUpdate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

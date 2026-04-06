import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/sales/SalesOverviewPageStyles.css";

export default function SalesOverviewPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState("0%");
  const [bestSellingItem, setBestSellingItem] = useState("-");
  const [lastSale, setLastSale] = useState("-");

  useEffect(() => {
    loadSalesOverview();
  }, []);

  const loadSalesOverview = async () => {
    try {
      const res = await api.get("/sales");
      const sales = res.data;

      // Total sales
      setTotalSales(sales.length);

      // Revenue
      const totalRevenue = sales.reduce(
        (sum, sale) => sum + Number(sale.totalAmount || 0),
        0
      );

      setRevenue(totalRevenue);

      // Pending orders
      // Your system currently has no status field
      setPendingOrders(0);

      // Monthly growth
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlySales = sales.filter((sale) => {
        const date = new Date(sale.createdAt);

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      });

      const growth =
        sales.length > 0
          ? ((monthlySales.length / sales.length) * 100).toFixed(1)
          : 0;

      setMonthlyGrowth(`+${growth}%`);

      // Best selling item
      const itemMap = {};

      sales.forEach((sale) => {
        sale.items?.forEach((item) => {
          const itemName = item.itemId?.itemName || "Unknown";

          itemMap[itemName] =
            (itemMap[itemName] || 0) + Number(item.quantity || 0);
        });
      });

      let bestItem = "-";
      let maxQty = 0;

      for (const itemName in itemMap) {
        if (itemMap[itemName] > maxQty) {
          maxQty = itemMap[itemName];
          bestItem = itemName;
        }
      }

      setBestSellingItem(bestItem);

      // Last sale
      if (sales.length > 0) {
        const latestSale = sales.reduce((latest, current) =>
          new Date(current.createdAt) > new Date(latest.createdAt)
            ? current
            : latest
        );

        setLastSale(
          new Date(latestSale.createdAt).toLocaleDateString()
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sov-wrapper">
      {/* HEADER */}
      <div className="sov-header">
        <span className="sov-badge">OVERVIEW</span>
        <h1>Sales Workspace</h1>
        <p>Monitor sales performance, revenue, and transactions.</p>
      </div>

      {/* STATS */}
      <div className="sov-cards">
        <div className="sov-card">
          <div className="sov-card-top">
            <span className="sov-icon">🧾</span>
            <span className="sov-label">Total Sales</span>
          </div>
          <h2>{totalSales}</h2>
        </div>

        <div className="sov-card success">
          <div className="sov-card-top">
            <span className="sov-icon">💰</span>
            <span className="sov-label">Revenue</span>
          </div>
          <h2>Rs. {revenue.toLocaleString()}</h2>
        </div>

        <div className="sov-card warning">
          <div className="sov-card-top">
            <span className="sov-icon">📉</span>
            <span className="sov-label">Pending Orders</span>
          </div>
          <h2>{pendingOrders}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="sov-insights">
        <h3>Sales Insights</h3>

        <div className="sov-insight-grid">
          <div className="sov-insight-box">
            <p>📈 Monthly Growth</p>
            <span>{monthlyGrowth}</span>
          </div>

          <div className="sov-insight-box">
            <p>🔥 Best Selling Item</p>
            <span>{bestSellingItem}</span>
          </div>

          <div className="sov-insight-box">
            <p>🕒 Last Sale</p>
            <span>{lastSale}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
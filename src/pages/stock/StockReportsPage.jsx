import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import "../../css/stock/StockReportsPageStyles.css";

export default function StockReportsPage() {
  const [stocks, setStocks] = useState([]);
  const LOW_STOCK_LIMIT = 10;

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data);
    } catch {
      toast.error("Failed to load stock reports");
    }
  };

  const summary = useMemo(() => {
    const totalItems = stocks.reduce((sum, s) => sum + s.quantity, 0);

    const totalValue = stocks.reduce(
      (sum, s) => sum + s.quantity * (s.itemId?.itemCostPrice || 0),
      0,
    );

    const lowStock = stocks.filter(
      (s) => s.quantity > 0 && s.quantity <= LOW_STOCK_LIMIT,
    ).length;

    const outOfStock = stocks.filter((s) => s.quantity === 0).length;

    const mostStock = [...stocks].sort((a, b) => b.quantity - a.quantity)[0];

    const leastStock = [...stocks].sort((a, b) => a.quantity - b.quantity)[0];

    return {
      totalItems,
      totalValue,
      lowStock,
      outOfStock,
      mostStock: mostStock?.itemId?.itemName || "N/A",
      leastStock: leastStock?.itemId?.itemName || "N/A",
    };
  }, [stocks]);

  const categoryData = useMemo(() => {
    const grouped = {};

    stocks.forEach((stock) => {
      const category = stock.itemId?.itemCategory || "Unknown";

      grouped[category] = (grouped[category] || 0) + stock.quantity;
    });

    return Object.entries(grouped).map(([name, quantity]) => ({
      name,
      quantity,
    }));
  }, [stocks]);

  const statusData = useMemo(() => {
    const available = stocks.filter((s) => s.quantity > LOW_STOCK_LIMIT).length;

    const low = stocks.filter(
      (s) => s.quantity > 0 && s.quantity <= LOW_STOCK_LIMIT,
    ).length;

    const out = stocks.filter((s) => s.quantity === 0).length;

    return [
      { name: "Available", value: available },
      { name: "Low Stock", value: low },
      { name: "Out of Stock", value: out },
    ];
  }, [stocks]);

  const movementData = useMemo(() => {
    const monthly = {};

    stocks.forEach((stock) => {
      const date = new Date(stock.updatedAt);
      const month = date.toLocaleString("default", {
        month: "short",
      });

      if (!monthly[month]) {
        monthly[month] = {
          month,
          added: 0,
          updated: 0,
        };
      }

      monthly[month].updated += stock.quantity;
    });

    return Object.values(monthly);
  }, [stocks]);

  const pieColors = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="sr-wrapper">
      <div className="sr-card">
        <div className="sr-header">
          <span className="sr-badge">REPORTS</span>
          <h1>Stock Reports</h1>
        </div>

        {/* SUMMARY */}
        <div className="sr-summary-grid">
          <div className="sr-box">
            <h3>{summary.totalItems}</h3>
            <p>Total Items</p>
          </div>

          <div className="sr-box">
            <h3>Rs. {summary.totalValue.toLocaleString()}</h3>
            <p>Total Stock Value</p>
          </div>

          <div className="sr-box">
            <h3>{summary.lowStock}</h3>
            <p>Low Stock</p>
          </div>

          <div className="sr-box">
            <h3>{summary.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>

          <div className="sr-box">
            <h3>{summary.mostStock}</h3>
            <p>Highest Stock Item</p>
          </div>

          <div className="sr-box">
            <h3>{summary.leastStock}</h3>
            <p>Least Stock Item</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="sr-charts-grid">
          <div className="sr-chart-box">
            <h2>Stock by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="sr-chart-box">
            <h2>Stock Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="sr-chart-box full-width">
            <h2>Monthly Stock Movement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movementData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Line dataKey="updated" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

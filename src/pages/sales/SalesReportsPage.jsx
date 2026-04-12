import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import "../../css/sales/SalesReportsPageStyles.css";
import { toast } from "sonner";

export default function SalesReportsPage() {
  const [sales, setSales] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales reports");
    }
  };

  // FILTERED SALES
  const filteredSales = useMemo(() => {
    const now = new Date();

    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);

      if (filterType === "today") {
        return saleDate.toDateString() === now.toDateString();
      }

      if (filterType === "week") {
        const last7 = new Date();
        last7.setDate(now.getDate() - 7);
        return saleDate >= last7;
      }

      if (filterType === "month") {
        return (
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      }

      if (filterType === "custom") {
        if (!fromDate || !toDate) return true;

        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        return saleDate >= from && saleDate <= to;
      }

      return true;
    });
  }, [sales, filterType, fromDate, toDate]);

  // SUMMARY
  const totalSales = useMemo(() => {
    return filteredSales.reduce(
      (sum, sale) => sum + Number(sale.totalAmount || 0),
      0,
    );
  }, [filteredSales]);

  const totalOrders = filteredSales.length;

  // SALES BY DATE
  const salesByDate = useMemo(() => {
    const grouped = {};

    filteredSales.forEach((sale) => {
      const date = new Date(sale.createdAt).toLocaleDateString("en-GB");

      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += Number(sale.totalAmount || 0);
    });

    return Object.entries(grouped)
      .map(([date, total]) => ({ date, total }))
      .sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")) -
          new Date(b.date.split("/").reverse().join("-")),
      );
  }, [filteredSales]);

  // SALES BY CATEGORY
  const salesByCategory = useMemo(() => {
    const grouped = {};

    filteredSales.forEach((sale) => {
      sale.items?.forEach((item) => {
        const category = item.itemId?.itemCategory || "Uncategorized";

        const subtotal =
          Number(item.subtotal) ||
          Number(item.unitPrice || 0) * Number(item.quantity || 0);

        if (!grouped[category]) grouped[category] = 0;
        grouped[category] += subtotal;
      });
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredSales]);

  // TOP PRODUCTS
  const topProducts = useMemo(() => {
    const grouped = {};

    filteredSales.forEach((sale) => {
      sale.items?.forEach((item) => {
        const name = item.itemId?.itemName || "Unknown Product";
        const quantity = Number(item.quantity || 0);
        const revenue = Number(item.subtotal || 0);

        if (!grouped[name]) {
          grouped[name] = {
            name,
            quantity: 0,
            revenue: 0,
          };
        }

        grouped[name].quantity += quantity;
        grouped[name].revenue += revenue;
      });
    });

    return Object.values(grouped)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredSales]);

  // EXPORT FUNCTIONS
  const printReport = () => {
    document.title = "Sales Report";
    window.print();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Sales Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Total Sales: Rs. ${totalSales.toLocaleString()}`, 14, 30);
    doc.text(`Total Orders: ${totalOrders}`, 14, 38);

    autoTable(doc, {
      startY: 50,
      head: [["Product", "Qty Sold", "Revenue"]],
      body: topProducts.map((p) => [
        p.name,
        p.quantity,
        `Rs. ${p.revenue.toLocaleString()}`,
      ]),
    });

    doc.save("sales-report.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(topProducts);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    XLSX.writeFile(workbook, "sales-report.xlsx");
  };

  const COLORS = ["#10b981", "#f59e0b", "#6366f1", "#ef4444", "#8b5cf6"];

  return (
    <div className="reports-wrapper">
      <div className="reports-card">
        <div className="reports-header">
          <span className="reports-badge">REPORTS</span>
          <h1>Sales Reports</h1>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <button
            className={filterType === "today" ? "active-filter" : ""}
            onClick={() => setFilterType("today")}
          >
            Today
          </button>

          <button
            className={filterType === "week" ? "active-filter" : ""}
            onClick={() => setFilterType("week")}
          >
            Last 7 Days
          </button>

          <button
            className={filterType === "month" ? "active-filter" : ""}
            onClick={() => setFilterType("month")}
          >
            This Month
          </button>

          <button
            className={filterType === "all" ? "active-filter" : ""}
            onClick={() => setFilterType("all")}
          >
            All Time
          </button>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setFilterType("custom");
            }}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setFilterType("custom");
            }}
          />
        </div>

        {/* ACTIONS */}
        <div className="report-actions">
          <button onClick={printReport}>Print Report</button>
          <button onClick={exportPDF}>Export PDF</button>
          <button onClick={exportExcel}>Export Excel</button>
        </div>

        {/* SUMMARY */}
        <div className="summary-grid">
          <div className="summary-box">
            <h3>Total Sales</h3>
            <p>Rs. {totalSales.toLocaleString()}</p>
          </div>

          <div className="summary-box">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts-grid">
          <div className="chart-box">
            <h2>Sales by Date</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total"
                  name="Sales (Rs)"
                  radius={[8, 8, 0, 0]}
                  fill="#f9b916"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h2>Sales by Category</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="top-products-section">
          <div className="chart-box">
            <h2>Top Best Selling Products</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="top-products-table-box">
            <h2>Product Details</h2>

            <table className="top-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>Rs. {product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

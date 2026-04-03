import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/distributor/DistributorOverviewPageStyles.css";

export default function DistributorOverviewPage() {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDistributors();
  }, []);

  const loadDistributors = async () => {
    try {
      const res = await api.get("/distributors");
      setDistributors(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const totalSuppliers = distributors.length;

  // Since there is no status field in your model,
  // use email + contact as active indicator
  const activeSuppliers = useMemo(() => {
    return distributors.filter(
      (d) =>
        d.distributorEmail?.trim() &&
        d.distributorContactNumber?.trim()
    ).length;
  }, [distributors]);

  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  const latestSupplier = useMemo(() => {
    if (!distributors.length) return "No data";

    const sorted = [...distributors].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sorted[0]?.distributorName || "No data";
  }, [distributors]);

  const lastRegistered = useMemo(() => {
    if (!distributors.length) return "No data";

    const sorted = [...distributors].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return new Date(sorted[0].createdAt).toLocaleDateString();
  }, [distributors]);

  const growthRate = useMemo(() => {
    if (!distributors.length) return "0%";

    const now = new Date();

    const thisMonth = distributors.filter((d) => {
      const date = new Date(d.createdAt);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    const percentage =
      totalSuppliers > 0
        ? ((thisMonth / totalSuppliers) * 100).toFixed(1)
        : 0;

    return `+${percentage}% this month`;
  }, [distributors, totalSuppliers]);

  if (loading) {
    return <div className="dov-wrapper">Loading supplier data...</div>;
  }

  return (
    <div className="dov-wrapper">
      {/* HEADER */}
      <div className="dov-header">
        <span className="dov-badge">OVERVIEW</span>
        <h1>Supplier & Distributor Workspace</h1>
        <p>
          Manage suppliers, monitor supply flow, and maintain partnerships.
        </p>
      </div>

      {/* STATS */}
      <div className="dov-cards">
        <div className="dov-card">
          <div className="dov-card-top">
            <span className="dov-icon">🚚</span>
            <span className="dov-label">Total Suppliers</span>
          </div>
          <h2>{totalSuppliers}</h2>
        </div>

        <div className="dov-card success">
          <div className="dov-card-top">
            <span className="dov-icon">📦</span>
            <span className="dov-label">Active Suppliers</span>
          </div>
          <h2>{activeSuppliers}</h2>
        </div>

        <div className="dov-card warning">
          <div className="dov-card-top">
            <span className="dov-icon">⚠️</span>
            <span className="dov-label">Inactive Suppliers</span>
          </div>
          <h2>{inactiveSuppliers}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="dov-insights">
        <h3>Supplier Insights</h3>

        <div className="dov-insight-grid">
          <div className="dov-insight-box">
            <p>📈 Supply Growth</p>
            <span>{growthRate}</span>
          </div>

          <div className="dov-insight-box">
            <p>⭐ Latest Supplier</p>
            <span>{latestSupplier}</span>
          </div>

          <div className="dov-insight-box">
            <p>🕒 Last Registered</p>
            <span>{lastRegistered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/promotion/PromotionOverviewPageStyles.css";

export default function PromotionOverviewPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const totalPromotions = promotions.length;

  const activePromotions = useMemo(() => {
    const today = new Date();

    return promotions.filter(
      (promo) =>
        promo.status === "active" &&
        new Date(promo.endDate) >= today
    ).length;
  }, [promotions]);

  const expiredPromotions = useMemo(() => {
    const today = new Date();

    return promotions.filter(
      (promo) =>
        new Date(promo.endDate) < today ||
        promo.status === "inactive"
    ).length;
  }, [promotions]);

  const avgDiscount = useMemo(() => {
    if (!promotions.length) return "0";

    const total = promotions.reduce(
      (sum, promo) => sum + Number(promo.discountValue || 0),
      0
    );

    return (total / promotions.length).toFixed(1);
  }, [promotions]);

  const latestPromotion = useMemo(() => {
    if (!promotions.length) return "No data";

    const sorted = [...promotions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sorted[0]?.promotionName || "No data";
  }, [promotions]);

  const latestDate = useMemo(() => {
    if (!promotions.length) return "No data";

    const sorted = [...promotions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sorted[0]?.createdAt
      ? new Date(sorted[0].createdAt).toLocaleDateString()
      : "No data";
  }, [promotions]);

  const bestPromotion = useMemo(() => {
    if (!promotions.length) return "No data";

    const sorted = [...promotions].sort(
      (a, b) => Number(b.discountValue) - Number(a.discountValue)
    );

    return sorted[0]?.promotionName || "No data";
  }, [promotions]);

  if (loading) {
    return <div className="proov-wrapper">Loading promotion data...</div>;
  }

  return (
    <div className="proov-wrapper">
      {/* HEADER */}
      <div className="proov-header">
        <span className="proov-badge">OVERVIEW</span>
        <h1>Promotion Workspace</h1>
        <p>
          Manage discounts, campaigns, and promotional strategies.
        </p>
      </div>

      {/* STATS */}
      <div className="proov-cards">
        <div className="proov-card">
          <div className="proov-card-top">
            <span className="proov-icon">🎯</span>
            <span className="proov-label">Total Promotions</span>
          </div>
          <h2>{totalPromotions}</h2>
        </div>

        <div className="proov-card success">
          <div className="proov-card-top">
            <span className="proov-icon">✅</span>
            <span className="proov-label">Active Promotions</span>
          </div>
          <h2>{activePromotions}</h2>
        </div>

        <div className="proov-card warning">
          <div className="proov-card-top">
            <span className="proov-icon">⏳</span>
            <span className="proov-label">Expired Promotions</span>
          </div>
          <h2>{expiredPromotions}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="proov-insights">
        <h3>Promotion Insights</h3>

        <div className="proov-insight-grid">
          <div className="proov-insight-box">
            <p>🔥 Highest Discount</p>
            <span>{bestPromotion}</span>
          </div>

          <div className="proov-insight-box">
            <p>💸 Avg Discount</p>
            <span>{avgDiscount}%</span>
          </div>

          <div className="proov-insight-box">
            <p>🕒 Latest Promotion</p>
            <span>{latestDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
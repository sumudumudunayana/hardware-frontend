import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/sales/SalesForecastingPageStyles.css";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function SalesForecastingPage() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const response = await api.post("/ai/predict");
      setForecasts(response.data || []);
    } catch (error) {
      console.error("Revenue forecast error:", error);
      toast.error("Failed to load forecast");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);
      const response = await api.post("/ai/retrain");
      toast.success(response.data.message || "Models retrained successfully");
      fetchForecast();
    } catch (error) {
      console.error("Retraining error:", error);
      toast.error("Retraining failed");
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const topProduct =
    forecasts.length > 0
      ? [...forecasts].sort(
          (a, b) => b.predicted_revenue - a.predicted_revenue
        )[0]
      : null;

  const growthPercentage = topProduct
    ? ((topProduct.predicted_revenue / 5000) * 100).toFixed(1)
    : 0;

  return (
    <div className="sales-forecast-page">
      <div className="sales-header">
        <div>
          <span className="sales-badge">AI FORECASTING</span>
          <h1>Sales Revenue Forecast</h1>
          <p>
            Monitor predicted revenue, expected demand, and AI-powered sales
            insights.
          </p>
        </div>

        <div className="sales-actions">
          <button onClick={fetchForecast}>
            {loading ? "Refreshing..." : "Refresh Forecast"}
          </button>
          <button className="retrain-btn" onClick={handleRetrain}>
            {retraining ? "Retraining..." : "Retrain AI Model"}
          </button>
        </div>
      </div>

      {forecasts.length > 0 && (
        <>
          {/* KPI CARDS */}
          {topProduct && (
            <div className="sales-cards">
              <div className="sales-card">
                <div className="sales-card-top">
                  <span className="sales-icon">🔥</span>
                  <span className="sales-label">Top Product</span>
                </div>
                <h2>{topProduct.product_name}</h2>
              </div>

              <div className="sales-card success">
                <div className="sales-card-top">
                  <span className="sales-icon">💰</span>
                  <span className="sales-label">Predicted Revenue</span>
                </div>
                <h2>LKR {topProduct.predicted_revenue}</h2>
              </div>

              <div className="sales-card warning">
                <div className="sales-card-top">
                  <span className="sales-icon">📈</span>
                  <span className="sales-label">Growth Estimate</span>
                </div>
                <h2>{growthPercentage}%</h2>
              </div>
            </div>
          )}

          {/* ALL PRODUCTS LIST */}
          <div className="sales-insight">
            <h3>All Product Forecasts</h3>

            <div className="sales-insight-grid">
              {forecasts.map((item, index) => (
                <div className="sales-insight-box" key={index}>
                  <p className="sales-product-title">
                    🔥 {item.product_name}
                  </p>

                  {/* Main metric — Revenue */}
                  <div className="sales-main-metric">
                    <span className="sales-metric-label">Revenue</span>
                    <div className="sales-metric-value">
                      LKR {item.predicted_revenue}
                    </div>
                  </div>

                  <div className="sales-metric-divider" />

                  {/* Sub metrics */}
                  <div className="sales-sub-metrics">
                    <div className="sales-sub-item">
                      <span className="sales-sub-label">Demand</span>
                      <strong className="sales-sub-value">
                        {item.predicted_demand}
                      </strong>
                    </div>

                    <div className="sales-sub-item">
                      <span className="sales-sub-label">Stock</span>
                      <strong
                        className={`sales-sub-value ${
                          item.current_stock === 0 ? "danger" : ""
                        }`}
                      >
                        {item.current_stock}
                      </strong>
                    </div>

                    <div className="sales-sub-item">
                      <span className="sales-sub-label">Recommended</span>
                      <strong className="sales-sub-value highlight">
                        {item.recommended_stock}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REVENUE COMPARISON CHART */}
          <div className="sales-chart-full">
            <div className="sales-chart-card">
              <h3>Revenue Comparison</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={forecasts.map((item) => ({
                    product: item.product_name,
                    revenue: item.predicted_revenue,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="Predicted Revenue" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* STOCK COMPARISON */}
          <div className="sales-chart-full">
            <div className="sales-chart-card">
              <h3>Stock Recommendation</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={forecasts.map((item) => ({
                    product: item.product_name,
                    currentStock: item.current_stock,
                    recommendedStock: item.recommended_stock,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="currentStock" name="Current Stock" fill="#94a3b8" />
                  <Bar dataKey="recommendedStock" name="Recommended Stock" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
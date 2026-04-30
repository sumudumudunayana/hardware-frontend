import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/item/DemandForecastingPageStyles.css";
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

export default function DemandForecastingPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const response = await api.post("/ai/predict");
      setPredictions(response.data || []);
    } catch (error) {
      console.error("Demand prediction error:", error);
      toast.error("Failed to load demand forecast");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);
      const response = await api.post("/ai/retrain");
      toast.success(response.data.message || "Models retrained successfully");
      fetchPrediction();
    } catch (error) {
      console.error("Retraining error:", error);
      toast.error("Retraining failed");
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const topProduct =
    predictions.length > 0
      ? [...predictions].sort(
          (a, b) => b.predicted_demand - a.predicted_demand
        )[0]
      : null;

  return (
    <div className="demand-page">
      <div className="page-header">
        <div>
          <span className="demand-badge">AI FORECASTING</span>
          <h1>Demand Forecasting</h1>
          <p>
            Monitor expected product demand, revenue forecasting, and smart
            inventory planning.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={fetchPrediction}>
            {loading ? "Refreshing..." : "Refresh Forecast"}
          </button>
          <button className="retrain-btn" onClick={handleRetrain}>
            {retraining ? "Retraining..." : "Retrain AI Model"}
          </button>
        </div>
      </div>

      {predictions.length > 0 && (
        <>
          {/* KPI CARDS */}
          {topProduct && (
            <div className="forecast-cards">
              <div className="forecast-card">
                <div className="card-top">
                  <span className="card-icon">📦</span>
                  <span className="card-label">Top Product</span>
                </div>
                <h2>{topProduct.product_name}</h2>
              </div>

              <div className="forecast-card success">
                <div className="card-top">
                  <span className="card-icon">📈</span>
                  <span className="card-label">Demand</span>
                </div>
                <h2>{topProduct.predicted_demand}</h2>
              </div>

              <div className="forecast-card warning">
                <div className="card-top">
                  <span className="card-icon">💰</span>
                  <span className="card-label">Revenue</span>
                </div>
                <h2>LKR {topProduct.predicted_revenue}</h2>
              </div>
            </div>
          )}

          {/* PRODUCT LIST */}
          <div className="demand-insight">
            <h3>All Product Predictions</h3>

            <div className="insight-grid">
              {predictions.map((item, index) => (
                <div className="insight-box" key={index}>
                  <p className="product-title">🔥 {item.product_name}</p>

                  {/* MAIN DEMAND */}
                  <div className="main-metric">
                    <span className="metric-label">Demand</span>
                    <div className="metric-value">{item.predicted_demand}</div>
                  </div>

                  <div className="metric-divider" />

                  {/* SUB METRICS */}
                  <div className="sub-metrics">
                    <div className="sub-metric-item">
                      <span className="sub-label">Revenue</span>
                      <strong className="sub-value">
                        LKR {item.predicted_revenue}
                      </strong>
                    </div>

                    <div className="sub-metric-item">
                      <span className="sub-label">Stock</span>
                      <strong
                        className={`sub-value ${
                          item.current_stock === 0 ? "danger" : ""
                        }`}
                      >
                        {item.current_stock}
                      </strong>
                    </div>

                    <div className="sub-metric-item">
                      <span className="sub-label">Recommended</span>
                      <strong className="sub-value highlight">
                        {item.recommended_stock}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHART */}
          <div className="demand-chart-card">
            <h3>Stock Recommendation</h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={predictions.map((item) => ({
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
                <Bar dataKey="recommendedStock" name="Recommended" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/item/DemandForecastingPageStyles.css";
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
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const requestBody = {
    product_id: "E001",
    unit_price: 650,
    quantity_sold: 10,
    month: 5,
    day: 1,
    day_of_week: 3,
    is_weekend: 0,
    rolling_avg_qty: 8,
    previous_qty: 9,
  };

  const fetchPrediction = async () => {
    try {
      setLoading(true);

      const response = await api.post("/ai/predict", requestBody);
      setPrediction(response.data);
    } catch (error) {
      console.error("Demand prediction error:", error);
      alert("Failed to load demand forecast");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);

      const response = await api.post("/ai/retrain");

      alert(response.data.message || "Models retrained successfully");

      fetchPrediction();
    } catch (error) {
      console.error("Retraining error:", error);
      alert("Retraining failed");
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    <div className="demand-page">
      {/* HEADER */}
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

      {prediction && (
        <>
          {/* CARDS */}
          <div className="forecast-cards">
            <div className="forecast-card">
              <div className="card-top">
                <span className="card-icon">📦</span>
                <span className="card-label">Predicted Demand</span>
              </div>
              <h2>{prediction.predicted_demand} Units</h2>
            </div>

            <div className="forecast-card success">
              <div className="card-top">
                <span className="card-icon">💰</span>
                <span className="card-label">Predicted Revenue</span>
              </div>
              <h2>LKR {prediction.predicted_revenue}</h2>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="demand-insight">
            <h3>High Demand Product Alert</h3>

            <div className="insight-grid">
              <div className="insight-box">
                <p>🔥 Product</p>
                <span>E001</span>
              </div>

              <div className="insight-box">
                <p>📈 Expected Demand</p>
                <span>{prediction.predicted_demand} Units</span>
              </div>

              <div className="insight-box">
                <p>📦 Suggested Stock</p>
                <span>{Math.ceil(prediction.predicted_demand + 5)} Units</span>
              </div>
            </div>
          </div>

          {/* CHART SECTION */}
          <div className="demand-chart-grid">
            {/* Top High-Demand Products */}
            <div className="demand-chart-card">
              <h3>Top High-Demand Products</h3>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  layout="vertical"
                  data={[
                    { product: "nails", demand: 120 },
                    { product: "brush", demand: 95 },
                    { product: "cutter", demand: 80 },
                    { product: "hammer", demand: 70 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="product" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="demand"
                    name="Predicted Demand"
                    fill="#f97316"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Recommendation */}
            <div className="demand-chart-card">
              <h3>Stock Recommendation</h3>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={[
                    {
                      product: "brush",
                      currentStock: 40,
                      recommendedStock: 80,
                    },
                    {
                      product: "cutter",
                      currentStock: 35,
                      recommendedStock: 70,
                    },
                    {
                      product: "hammer",
                      currentStock: 20,
                      recommendedStock: 50,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="currentStock"
                    name="Current Stock"
                    fill="#94a3b8"
                  />

                  <Bar
                    dataKey="recommendedStock"
                    name="Recommended Stock"
                    fill="#f97316"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

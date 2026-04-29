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
  LineChart,
  Line,
} from "recharts";

export default function DemandForecastingPage() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const fetchPrediction = async () => {
    try {
      setLoading(true);

      const response = await api.post("/ai/predict");

      setPrediction(response.data);
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

      toast.success(
        response.data.message || "Models retrained successfully"
      );

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

  return (
    <div className="demand-page">
      <div className="page-header">
        <div>
          <span className="demand-badge">AI FORECASTING</span>
          <h1>Demand Forecasting</h1>
          <p>
            Monitor expected product demand, revenue forecasting,
            and smart inventory planning.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={fetchPrediction}>
            {loading ? "Refreshing..." : "Refresh Forecast"}
          </button>

          <button
            className="retrain-btn"
            onClick={handleRetrain}
          >
            {retraining ? "Retraining..." : "Retrain AI Model"}
          </button>
        </div>
      </div>

      {prediction && (
        <>
          {/* KPI CARDS */}
          <div className="forecast-cards">
            <div className="forecast-card">
              <div className="card-top">
                <span className="card-icon">📦</span>
                <span className="card-label">
                  Predicted Demand
                </span>
              </div>

              <h2>
                {prediction.predicted_demand} Units
              </h2>
            </div>

            <div className="forecast-card success">
              <div className="card-top">
                <span className="card-icon">💰</span>
                <span className="card-label">
                  Predicted Revenue
                </span>
              </div>

              <h2>
                LKR {prediction.predicted_revenue}
              </h2>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="demand-insight">
            <h3>High Demand Product Alert</h3>

            <div className="insight-grid">
              <div className="insight-box">
                <p>🔥 Product</p>
                <span>
                  {prediction.product_name ||
                    prediction.product_id}
                </span>
              </div>

              <div className="insight-box">
                <p>📈 Expected Demand</p>
                <span>
                  {prediction.predicted_demand} Units
                </span>
              </div>

              <div className="insight-box">
                <p>📦 Current Stock</p>
                <span>
                  {prediction.current_stock} Units
                </span>
              </div>

              <div className="insight-box">
                <p>✅ Recommended Stock</p>
                <span>
                  {prediction.recommended_stock} Units
                </span>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="demand-chart-grid">
            {/* Monthly Revenue Forecast */}
            <div className="demand-chart-card">
              <h3>Monthly Revenue Forecast</h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <LineChart
                  data={prediction.monthly_forecast || []}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="lastYearRevenue"
                    name="Last Year Revenue"
                  />

                  <Line
                    type="monotone"
                    dataKey="predictedRevenue"
                    name="Predicted Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Real Stock Recommendation */}
            <div className="demand-chart-card">
              <h3>Stock Recommendation</h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={[
                    {
                      product:
                        prediction.product_name ||
                        prediction.product_id,

                      currentStock:
                        prediction.current_stock || 0,

                      recommendedStock:
                        prediction.recommended_stock || 0,
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
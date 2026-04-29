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
  LineChart,
  Line,
} from "recharts";

export default function SalesForecastingPage() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const fetchForecast = async () => {
    try {
      setLoading(true);

      const response = await api.post("/ai/predict");

      setForecast(response.data);
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

      toast.success(
        response.data.message || "Models retrained successfully"
      );

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

  const growthPercentage = forecast
    ? ((forecast.predicted_revenue / 5000) * 100).toFixed(1)
    : 0;

  return (
    <div className="sales-forecast-page">
      <div className="sales-header">
        <div>
          <span className="sales-badge">AI FORECASTING</span>
          <h1>Sales Revenue Forecast</h1>
          <p>
            Monitor predicted revenue, expected demand,
            and AI-powered sales insights.
          </p>
        </div>

        <div className="sales-actions">
          <button onClick={fetchForecast}>
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

      {forecast && (
        <>
          {/* KPI CARDS */}
          <div className="sales-cards">
            <div className="sales-card">
              <div className="sales-card-top">
                <span className="sales-icon">💰</span>
                <span className="sales-label">
                  Predicted Revenue
                </span>
              </div>

              <h2>
                LKR {forecast.predicted_revenue}
              </h2>
            </div>

            <div className="sales-card success">
              <div className="sales-card-top">
                <span className="sales-icon">📦</span>
                <span className="sales-label">
                  Expected Demand
                </span>
              </div>

              <h2>
                {forecast.predicted_demand} Units
              </h2>
            </div>

            <div className="sales-card warning">
              <div className="sales-card-top">
                <span className="sales-icon">📈</span>
                <span className="sales-label">
                  Growth Estimate
                </span>
              </div>

              <h2>{growthPercentage}%</h2>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="sales-insight">
            <h3>Revenue Insight</h3>

            <div className="sales-insight-grid">
              <div className="sales-insight-box">
                <p>🔥 Product</p>
                <span>
                  {forecast.product_name ||
                    forecast.product_id}
                </span>
              </div>

              <div className="sales-insight-box">
                <p>💵 Forecast Revenue</p>
                <span>
                  LKR {forecast.predicted_revenue}
                </span>
              </div>

              <div className="sales-insight-box">
                <p>📦 Current Stock</p>
                <span>
                  {forecast.current_stock} Units
                </span>
              </div>

              <div className="sales-insight-box">
                <p>✅ Recommended Stock</p>
                <span>
                  {forecast.recommended_stock} Units
                </span>
              </div>

              <div className="sales-insight-box">
                <p>🚀 Growth Rate</p>
                <span>{growthPercentage}%</span>
              </div>
            </div>
          </div>

          {/* MONTHLY FORECAST CHART */}
          <div className="sales-chart-full">
            <div className="sales-chart-card">
              <h3>12 Month Revenue Forecast</h3>

              <ResponsiveContainer
                width="100%"
                height={380}
              >
                <LineChart
                  data={forecast.monthly_forecast || []}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="lastYearRevenue"
                    stroke="#94a3b8"
                    strokeWidth={3}
                    name="Last Year Revenue"
                  />

                  <Line
                    type="monotone"
                    dataKey="predictedRevenue"
                    stroke="#f97316"
                    strokeWidth={3}
                    name="Predicted Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* REAL STOCK RECOMMENDATION */}
          <div className="sales-chart-full">
            <div className="sales-chart-card">
              <h3>Stock Recommendation</h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={[
                    {
                      product:
                        forecast.product_name ||
                        forecast.product_id,

                      currentStock:
                        forecast.current_stock || 0,

                      recommendedStock:
                        forecast.recommended_stock || 0,
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
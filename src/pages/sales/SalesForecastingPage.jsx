import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/sales/SalesForecastingPageStyles.css";

export default function SalesForecastingPage() {
  const [forecast, setForecast] = useState(null);
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

  const fetchForecast = async () => {
    try {
      setLoading(true);

      const response = await api.post("/ai/predict", requestBody);

      setForecast(response.data);
    } catch (error) {
      console.error("Revenue forecast error:", error);
      alert("Failed to load forecast");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);

      const response = await api.post("/ai/retrain");

      alert(response.data.message || "Models retrained successfully");

      // Refresh forecast after retraining
      fetchForecast();
    } catch (error) {
      console.error("Retraining error:", error);
      alert("Retraining failed");
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
        <h1>Sales Revenue Forecast</h1>

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
          <div className="sales-cards">
            <div className="sales-card">
              <h3>Predicted Revenue</h3>
              <p>LKR {forecast.predicted_revenue}</p>
            </div>

            <div className="sales-card">
              <h3>Expected Demand</h3>
              <p>{forecast.predicted_demand} Units</p>
            </div>

            <div className="sales-card">
              <h3>Growth Estimate</h3>
              <p>{growthPercentage}%</p>
            </div>
          </div>

          <div className="insight-card">
            <h2>Revenue Insight</h2>
            <p>
              Estimated revenue for the next forecast cycle is{" "}
              <strong>LKR {forecast.predicted_revenue}</strong>.
            </p>
            <p>
              Sales demand is projected at{" "}
              <strong>{forecast.predicted_demand} units</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
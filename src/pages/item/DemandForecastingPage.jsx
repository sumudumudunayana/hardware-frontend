import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/item/DemandForecastingPageStyles.css";

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

      // Refresh prediction after retraining
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
      <div className="page-header">
        <h1>Demand Forecasting</h1>

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
          <div className="forecast-cards">
            <div className="forecast-card">
              <h3>Predicted Demand</h3>
              <p>{prediction.predicted_demand} Units</p>
            </div>

            <div className="forecast-card">
              <h3>Predicted Revenue</h3>
              <p>LKR {prediction.predicted_revenue}</p>
            </div>
          </div>

          <div className="top-products-card">
            <h2>High Demand Product Alert</h2>
            <p>
              Product <strong>E001</strong> is expected to have high demand.
            </p>
            <p>
              Suggested stock level:{" "}
              <strong>
                {Math.ceil(prediction.predicted_demand + 5)} units
              </strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
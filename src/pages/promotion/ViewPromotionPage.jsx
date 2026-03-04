import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ViewPromotionPageStyles.css";

export default function ViewPromotionPage() {
  const [promotions, setPromotions] = useState([]);

  const loadPromotions = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/promotions");
      setPromotions(res.data);
    } catch (err) {
      console.error("Failed loading promotions", err);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  return (
    <div className="promo-view-container">
      <div className="promo-view-overlay"></div>

      <div className="promo-view-content">
        <h1 className="promo-view-title">Active Promotions</h1>

        <div className="promo-card-grid">
          {promotions.length > 0 ? (
            promotions.map((promo) => (
              <div key={promo._id} className="promo-card">

                <div className={`promo-status ${promo.status}`}>
                  {promo.status.toUpperCase()}
                </div>

                <h2>{promo.promotionName}</h2>

                <p className="promo-description">
                  {promo.promotionDescription}
                </p>

                <div className="promo-discount">
                  {promo.discountType === "percentage"
                    ? `${promo.discountValue}% OFF`
                    : `Rs. ${promo.discountValue} OFF`}
                </div>

                <div className="promo-dates">
                  <span>Start: {new Date(promo.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(promo.endDate).toLocaleDateString()}</span>
                </div>

                {promo.applyTo === "specific" && promo.itemId && (
                  <div className="promo-item">
                    Applies to: {promo.itemId.itemName}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-promotions">No promotions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
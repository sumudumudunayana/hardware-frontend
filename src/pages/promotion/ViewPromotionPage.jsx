import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/promotion/ViewPromotionPageStyles.css";

export default function ViewPromotionPage() {
  const [promotions, setPromotions] = useState([]);

  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  return (
    <div className="prmv-wrapper">
      <div className="prmv-header">
        <span className="prmv-badge">PROMOTIONS</span>
        <h1>Active Promotions</h1>
      </div>

      <div className="prmv-grid">
        {promotions.length > 0 ? (
          promotions.map((promo) => (
            <div key={promo._id} className="prmv-card">
              <div className={`prmv-status ${promo.status}`}>
                {promo.status}
              </div>

              <h2>{promo.promotionName}</h2>

              <p className="prmv-desc">{promo.promotionDescription}</p>

              <div className="prmv-discount">
                {promo.discountType === "percentage"
                  ? `${promo.discountValue}% OFF`
                  : `Rs. ${promo.discountValue} OFF`}
              </div>

              <div className="prmv-dates">
                <span>
                  Start: {new Date(promo.startDate).toLocaleDateString()}
                </span>
                <span>End: {new Date(promo.endDate).toLocaleDateString()}</span>
              </div>

              {promo.applyTo === "specific" && promo.itemId && (
                <div className="prmv-item">Item: {promo.itemId.itemName}</div>
              )}
            </div>
          ))
        ) : (
          <div className="prmv-empty">No promotions available</div>
        )}
      </div>
    </div>
  );
}

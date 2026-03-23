import "../../css/promotion/PromotionOverviewPageStyles.css";

export default function PromotionOverviewPage() {
  return (
    <div className="proov-wrapper">

      {/* HEADER */}
      <div className="proov-header">
        <span className="proov-badge">OVERVIEW</span>
        <h1>Promotion Workspace</h1>
        <p>Manage discounts, campaigns, and promotional strategies.</p>
      </div>

      {/* STATS */}
      <div className="proov-cards">

        <div className="proov-card">
          <div className="proov-card-top">
            <span className="proov-icon">🎯</span>
            <span className="proov-label">Total Promotions</span>
          </div>
          <h2>18</h2>
        </div>

        <div className="proov-card success">
          <div className="proov-card-top">
            <span className="proov-icon">✅</span>
            <span className="proov-label">Active Promotions</span>
          </div>
          <h2>12</h2>
        </div>

        <div className="proov-card warning">
          <div className="proov-card-top">
            <span className="proov-icon">⏳</span>
            <span className="proov-label">Expired Promotions</span>
          </div>
          <h2>6</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="proov-insights">
        <h3>Promotion Insights</h3>

        <div className="proov-insight-grid">

          <div className="proov-insight-box">
            <p>🔥 Best Performing</p>
            <span>New Year Sale</span>
          </div>

          <div className="proov-insight-box">
            <p>💸 Avg Discount</p>
            <span>15%</span>
          </div>

          <div className="proov-insight-box">
            <p>🕒 Latest Promotion</p>
            <span>Today</span>
          </div>

        </div>
      </div>

    </div>
  );
}
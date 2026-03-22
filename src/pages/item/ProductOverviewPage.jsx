import "../../css/item/ProductOverviewPageStyles.css";

export default function ProductOverviewPage() {
  return (
    <div className="pov-wrapper">

      {/* HEADER */}
      <div className="pov-header">
        <span className="pov-badge">OVERVIEW</span>
        <h1>Product Workspace</h1>
        <p>Manage items, categories, pricing, and inventory efficiently.</p>
      </div>

      {/* STATS */}
      <div className="pov-cards">

        <div className="pov-card">
          <div className="pov-card-top">
            <span className="pov-icon">📦</span>
            <span className="pov-label">Total Items</span>
          </div>
          <h2>120</h2>
        </div>

        <div className="pov-card warning">
          <div className="pov-card-top">
            <span className="pov-icon">⚠️</span>
            <span className="pov-label">Low Stock</span>
          </div>
          <h2>8</h2>
        </div>

        <div className="pov-card success">
          <div className="pov-card-top">
            <span className="pov-icon">📊</span>
            <span className="pov-label">Categories</span>
          </div>
          <h2>12</h2>
        </div>

      </div>

      {/* EXTRA SECTION (fills empty space nicely) */}
      <div className="pov-insights">
        <h3>Quick Insights</h3>

        <div className="pov-insight-grid">

          <div className="pov-insight-box">
            <p>📈 Stock Growth</p>
            <span>+12% this month</span>
          </div>

          <div className="pov-insight-box">
            <p>🔥 Top Category</p>
            <span>Electronics</span>
          </div>

          <div className="pov-insight-box">
            <p>🕒 Last Update</p>
            <span>Today</span>
          </div>

        </div>
      </div>

    </div>
  );
}
import "../../css/distributor/DistributorOverviewPageStyles.css";

export default function DistributorOverviewPage() {
  return (
    <div className="dov-wrapper">

      {/* HEADER */}
      <div className="dov-header">
        <span className="dov-badge">OVERVIEW</span>
        <h1>Supplier & Distributor Workspace</h1>
        <p>Manage suppliers, monitor supply flow, and maintain partnerships.</p>
      </div>

      {/* STATS */}
      <div className="dov-cards">

        <div className="dov-card">
          <div className="dov-card-top">
            <span className="dov-icon">🚚</span>
            <span className="dov-label">Total Suppliers</span>
          </div>
          <h2>45</h2>
        </div>

        <div className="dov-card success">
          <div className="dov-card-top">
            <span className="dov-icon">📦</span>
            <span className="dov-label">Active Suppliers</span>
          </div>
          <h2>30</h2>
        </div>

        <div className="dov-card warning">
          <div className="dov-card-top">
            <span className="dov-icon">⚠️</span>
            <span className="dov-label">Inactive Suppliers</span>
          </div>
          <h2>15</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="dov-insights">
        <h3>Supplier Insights</h3>

        <div className="dov-insight-grid">

          <div className="dov-insight-box">
            <p>📈 Supply Growth</p>
            <span>+9% this month</span>
          </div>

          <div className="dov-insight-box">
            <p>⭐ Top Supplier</p>
            <span>ABC Distributors</span>
          </div>

          <div className="dov-insight-box">
            <p>🕒 Last Delivery</p>
            <span>Yesterday</span>
          </div>

        </div>
      </div>

    </div>
  );
}
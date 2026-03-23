import "../../css/sales/SalesOverviewPageStyles.css";

export default function SalesOverviewPage() {
  return (
    <div className="sov-wrapper">

      {/* HEADER */}
      <div className="sov-header">
        <span className="sov-badge">OVERVIEW</span>
        <h1>Sales Workspace</h1>
        <p>Monitor sales performance, revenue, and transactions.</p>
      </div>

      {/* STATS */}
      <div className="sov-cards">

        <div className="sov-card">
          <div className="sov-card-top">
            <span className="sov-icon">🧾</span>
            <span className="sov-label">Total Sales</span>
          </div>
          <h2>320</h2>
        </div>

        <div className="sov-card success">
          <div className="sov-card-top">
            <span className="sov-icon">💰</span>
            <span className="sov-label">Revenue</span>
          </div>
          <h2>Rs. 450,000</h2>
        </div>

        <div className="sov-card warning">
          <div className="sov-card-top">
            <span className="sov-icon">📉</span>
            <span className="sov-label">Pending Orders</span>
          </div>
          <h2>12</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="sov-insights">
        <h3>Sales Insights</h3>

        <div className="sov-insight-grid">

          <div className="sov-insight-box">
            <p>📈 Monthly Growth</p>
            <span>+18%</span>
          </div>

          <div className="sov-insight-box">
            <p>🔥 Best Selling Item</p>
            <span>Laptop</span>
          </div>

          <div className="sov-insight-box">
            <p>🕒 Last Sale</p>
            <span>Today</span>
          </div>

        </div>
      </div>

    </div>
  );
}
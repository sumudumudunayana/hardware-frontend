import "../../css/customer/CustomerOverviewPageStyles.css";

export default function CustomerOverviewPage() {
  return (
    <div className="cov-wrapper">

      {/* HEADER */}
      <div className="cov-header">
        <span className="cov-badge">OVERVIEW</span>
        <h1>Customer Workspace</h1>
        <p>Manage customers, track activity, and improve relationships.</p>
      </div>

      {/* STATS */}
      <div className="cov-cards">

        <div className="cov-card">
          <div className="cov-card-top">
            <span className="cov-icon">👥</span>
            <span className="cov-label">Total Customers</span>
          </div>
          <h2>250</h2>
        </div>

        <div className="cov-card warning">
          <div className="cov-card-top">
            <span className="cov-icon">🆕</span>
            <span className="cov-label">New Customers</span>
          </div>
          <h2>15</h2>
        </div>

        <div className="cov-card success">
          <div className="cov-card-top">
            <span className="cov-icon">💰</span>
            <span className="cov-label">Active Buyers</span>
          </div>
          <h2>120</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="cov-insights">
        <h3>Customer Insights</h3>

        <div className="cov-insight-grid">

          <div className="cov-insight-box">
            <p>📈 Growth Rate</p>
            <span>+10% this month</span>
          </div>

          <div className="cov-insight-box">
            <p>⭐ Top Customer</p>
            <span>Kamal Perera</span>
          </div>

          <div className="cov-insight-box">
            <p>🕒 Last Registered</p>
            <span>Today</span>
          </div>

        </div>
      </div>

    </div>
  );
}
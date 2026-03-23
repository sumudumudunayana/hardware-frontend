import "../../css/stock/StockOverviewPageStyles.css";

export default function StockOverviewPage() {
  return (
    <div className="stk-wrapper">

      {/* HEADER */}
      <div className="stk-header">
        <span className="stk-badge">OVERVIEW</span>
        <h1>Stock Workspace</h1>
        <p>Monitor inventory levels, stock movements, and availability.</p>
      </div>

      {/* STATS */}
      <div className="stk-cards">

        <div className="stk-card">
          <div className="stk-card-top">
            <span className="stk-icon">📦</span>
            <span className="stk-label">Total Items in Stock</span>
          </div>
          <h2>1,250</h2>
        </div>

        <div className="stk-card success">
          <div className="stk-card-top">
            <span className="stk-icon">✅</span>
            <span className="stk-label">Available Stock</span>
          </div>
          <h2>1,100</h2>
        </div>

        <div className="stk-card warning">
          <div className="stk-card-top">
            <span className="stk-icon">⚠️</span>
            <span className="stk-label">Low Stock Items</span>
          </div>
          <h2>35</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="stk-insights">
        <h3>Stock Insights</h3>

        <div className="stk-insight-grid">

          <div className="stk-insight-box">
            <p>📥 Recent Stock Added</p>
            <span>+120 Items</span>
          </div>

          <div className="stk-insight-box">
            <p>🔥 Fast Moving Item</p>
            <span>Mouse</span>
          </div>

          <div className="stk-insight-box">
            <p>🕒 Last Updated</p>
            <span>Today</span>
          </div>

        </div>
      </div>

    </div>
  );
}
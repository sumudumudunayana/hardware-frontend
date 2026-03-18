import "../../css/item/ProductOverviewPageStyles.css";

export default function ProductOverviewPage() {
  return (
    <div className="product-overview-container">
      <span className="product-overview-badge">OVERVIEW</span>

      <h1 className="product-overview-title">Product Workspace</h1>

      <p className="product-overview-subtitle">
        Manage items, categories, pricing, and inventory efficiently.
      </p>

      <div className="product-overview-cards">
        <div className="product-overview-card">
          <h3>Total Items</h3>
          <p>120</p>
        </div>

        <div className="product-overview-card">
          <h3>Low Stock</h3>
          <p>8</p>
        </div>

        <div className="product-overview-card">
          <h3>Categories</h3>
          <p>12</p>
        </div>
      </div>
    </div>
  );
}
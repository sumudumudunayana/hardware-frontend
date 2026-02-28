import React, { useState } from "react";
import "../css/AddSalesPageStyles.css";
import { useNavigate } from "react-router-dom";

const dummyProducts = [
  {
    id: 1,
    name: "Angle Grinder",
    price: 10000,
    category: "Power Tools",
    material: "Metal",
  },
  { id: 2, name: "Axe", price: 3500, category: "Hand Tools", material: "Wood" },
  {
    id: 3,
    name: "Circular Saw",
    price: 15000,
    category: "Power Tools",
    material: "Metal",
  },
  {
    id: 4,
    name: "Bolts Pack",
    price: 300,
    category: "Hardware",
    material: "Steel",
  },
  {
    id: 5,
    name: "Chisel",
    price: 1000,
    category: "Hand Tools",
    material: "Metal",
  },
  {
    id: 6,
    name: "Concrete Mixer",
    price: 90000,
    category: "Machines",
    material: "Metal",
  },
  {
    id: 7,
    name: "Cable Ties",
    price: 250,
    category: "Hardware",
    material: "Plastic",
  },
  {
    id: 8,
    name: "Cordless Drill",
    price: 11000,
    category: "Power Tools",
    material: "Metal",
  },
];

export default function AddSalesPage({ cart, setCart }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Power Tools",
    "Hand Tools",
    "Hardware",
    "Machines",
  ];
  const materials = ["All", "Metal", "Wood", "Plastic", "Steel"];

  const filteredProducts = dummyProducts.filter((product) => {
    return (
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (selectedMaterial === "All" || product.material === selectedMaterial)
    );
  });

  const handleAdd = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <div className="sales-page-container">
      {/* LEFT FILTER PANEL */}
      <div className="filter-panel">
        <h2>Filters</h2>

        <div className="filter-section">
          <h4>Category</h4>
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active-filter" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-section">
          <h4>Material</h4>
          {materials.map((mat) => (
            <button
              key={mat}
              className={selectedMaterial === mat ? "active-filter" : ""}
              onClick={() => setSelectedMaterial(mat)}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT AREA */}
      <div className="product-area">
        {/* 🔥 TOP BAR */}
        <div className="sales-topbar">
          <h1>Add Sales Items</h1>

          <div className="cart-summary">
            <div className="total-box">
              Total: Rs. {totalPrice.toLocaleString()}
            </div>

            <button className="cart-btn" onClick={() => navigate("/CartPage")}>
              🛒 Cart ({cart.length})
            </button>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>Rs. {product.price.toLocaleString()}</p>
              <span className="tag">{product.category}</span>
              <span className="tag material">{product.material}</span>
              <button onClick={() => handleAdd(product)}>Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

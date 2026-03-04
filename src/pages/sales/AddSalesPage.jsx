import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/AddSalesPageStyles.css";
import { useNavigate } from "react-router-dom";

export default function AddSalesPage({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  // 🔥 LOAD ITEMS FROM DATABASE
  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/items");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed loading items", err);
      }
    };

    loadItems();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.itemCategory))
  ];

  const filteredProducts = products.filter((product) =>
    selectedCategory === "All"
      ? true
      : product.itemCategory === selectedCategory
  );

  const handleAdd = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          _id: product._id,
          name: product.itemName,
          price: product.itemSellingPrice,
          qty: 1
        }
      ]);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <div className="sales-page-container">

      {/* FILTER PANEL */}
      <div className="filter-panel">
        <h2>Categories</h2>

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

      {/* PRODUCT AREA */}
      <div className="product-area">
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
            <div key={product._id} className="product-card">
              <h3>{product.itemName}</h3>
              <p>Rs. {product.itemSellingPrice.toLocaleString()}</p>
              <span className="tag">{product.itemCategory}</span>
              <button onClick={() => handleAdd(product)}>Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
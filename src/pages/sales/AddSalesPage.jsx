import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../css/sales/AddSalesPageStyles.css";
import { useNavigate } from "react-router-dom";

export default function AddSalesPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // LOAD ITEMS + CART
  useEffect(() => {
    loadItems();
    loadCart();
  }, []);

  // LOAD PRODUCTS
  const loadItems = async () => {
    try {
      const res = await api.get("/items");

      setProducts(res.data);
    } catch (err) {
      console.error("Failed loading items", err);
    }
  };

  // LOAD CART
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");

      const items = res.data.items || [];

      setCart(items);

      const totalQty = items.reduce(
        (sum, it) => sum + Number(it.quantity || 0),
        0,
      );

      setCartCount(totalQty);
    } catch (err) {
      console.error("Cart load error", err);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.itemCategory))];

  const filteredProducts = products.filter((product) =>
    selectedCategory === "All"
      ? true
      : product.itemCategory === selectedCategory,
  );

  // ADD ITEM TO CART
  const handleAdd = async (product) => {
    try {
      await api.post("/cart/add", {
        itemId: product._id,
        name: product.itemName,
        price: product.itemSellingPrice,
      });

      loadCart(); //  refresh cart + total
    } catch (err) {
      console.error("Cart add error", err);
    }
  };

  //  TOTAL CALCULATION RESTORED
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,

    0,
  );

  return (
    <div className="sales-page-container">

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
          <h1>Add Order Items</h1>

          <div className="cart-summary">
            {" "}
            <div className="total-box">
              Total: Rs. {totalPrice.toLocaleString()}
            </div>
            <button className="cart-btn" onClick={() => navigate("/CartPage")}>
              🛒 Cart ({cartCount})
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

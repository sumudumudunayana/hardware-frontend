import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../css/sales/AddSalesPageStyles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddSalesPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
    loadCart();
  }, []);

  // LOAD ITEMS + STOCK (FIXED)
  const loadItems = async () => {
    try {
      const [itemRes, stockRes] = await Promise.all([
        api.get("/items"),
        api.get("/stocks"),
      ]);

      const stockMap = {};

      // FIX: SUM stock quantities
      stockRes.data.forEach((stock) => {
        const id = stock.itemId?._id || stock.itemId;

        if (!stockMap[id]) {
          stockMap[id] = 0;
        }

        stockMap[id] += stock.quantity;
      });

      const mergedProducts = itemRes.data.map((item) => ({
        ...item,
        quantity: stockMap[item._id] || 0,
      }));

      setProducts(mergedProducts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load items");
    }
  };

  // LOAD CART
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data.items || [];

      setCart(items);

      setCartCount(
        items.reduce((sum, it) => sum + Number(it.quantity || 0), 0),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.itemCategory))];

  const filteredProducts = products.filter((p) =>
    selectedCategory === "All" ? true : p.itemCategory === selectedCategory,
  );

  // ADD TO CART (WITH STOCK LIMIT CHECK)
  const handleAdd = async (product) => {
    const cartItem = cart.find((c) => c.itemId === product._id);
    const currentQty = cartItem ? cartItem.quantity : 0;

    // Prevent exceeding stock
    if (currentQty >= product.quantity) {
      toast.warning("Stock limit reached");
      return;
    }

    try {
      await api.post("/cart/add", {
        itemId: product._id,
        name: product.itemName,
        price: product.itemSellingPrice,
      });

      loadCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="sales-page-wrapper">
      {/* CATEGORY PANEL */}
      <aside className="sales-page-sidebar">
        <h3>Categories</h3>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`sales-page-category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <div className="sales-page-main">
        <div className="sales-page-header">
          <h1>Add Order Items</h1>

          <div className="sales-page-summary">
            <div className="sales-page-total">
              Rs. {totalPrice.toLocaleString()}
            </div>

            <button
              className="sales-page-cart-btn"
              onClick={() => navigate("/sales/cart")}
            >
              🛒 ({cartCount})
            </button>
          </div>
        </div>

        <div className="sales-page-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="sales-page-card">
              <h3>{product.itemName}</h3>

              <p>Rs. {product.itemSellingPrice.toLocaleString()}</p>

              <span className="sales-page-tag">{product.itemCategory}</span>

              {/* STOCK DISPLAY */}
              <div className="sales-page-qty">Qty: {product.quantity}</div>

              {/* LOW STOCK WARNING */}
              {product.quantity > 0 && product.quantity <= 5 && (
                <div style={{ color: "orange", fontSize: "12px" }}>
                  Low stock
                </div>
              )}

              {/* BUTTON */}
              <button
                disabled={product.quantity === 0}
                onClick={() => handleAdd(product)}
              >
                {product.quantity === 0 ? "Out of Stock" : "Add"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

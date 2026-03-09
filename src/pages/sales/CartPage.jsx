import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/sales/CartPageStyles.css";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [appliedPromotions, setAppliedPromotions] = useState([]);

  // LOAD DATA
  useEffect(() => {
    loadCart();
    loadPromotions();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Cart load error", err);
    }
  };

  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data || []);
    } catch (err) {
      console.error("Promotion load error", err);
    }
  };

  // QTY CHANGES
  const increaseQty = async (item) => {
    await api.put("/cart/update", {
      itemId: item.itemId,
      quantity: item.quantity + 1,
    });
    loadCart();
  };

  const decreaseQty = async (item) => {
    const newQty = item.quantity - 1;

    try {
      if (newQty <= 0) {
        await api.delete(`/cart/remove/${item.itemId}`);
      } else {
        await api.put("/cart/update", {
          itemId: item.itemId,
          quantity: newQty,
        });
      }
      loadCart();
    } catch (err) {
      console.error("Cart update error", err);
    }
  };

  // SUBTOTAL
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // ✅ PROMO CALC (percentage first, fixed once)
  useEffect(() => {
    const now = new Date();

    const activePromos = (promotions || []).filter((p) => {
      if (p.status !== "active") return false;

      const start = new Date(p.startDate);
      const end = new Date(p.endDate);

      return now >= start && now <= end;
    });

    // Helper: item subtotal
    const itemTotal = (item) => Number(item.price) * Number(item.quantity);

    // 1) Percentage promos (can be item-specific or all)
    const percentagePromos = activePromos.filter(
      (p) => p.discountType === "percentage",
    );

    const percentageLines = [];
    let totalPercentageDiscount = 0;

    for (const promo of percentagePromos) {
      let base = 0;

      if (promo.applyTo === "all") {
        base = subtotal;
      } else if (promo.applyTo === "specific") {
        // apply once based on that item’s total (qty included)
        const match = cart.find((c) => c.itemId === promo.itemId?._id);
        if (match) base = itemTotal(match);
      }

      if (base > 0) {
        const amount = base * (Number(promo.discountValue) / 100);
        if (amount > 0) {
          totalPercentageDiscount += amount;
          percentageLines.push({
            name: `${promo.promotionName} (${promo.discountValue}%)`,
            amount,
            type: "percentage",
          });
        }
      }
    }

    // ✅ new subtotal after percentage discounts
    const afterPercentage = Math.max(subtotal - totalPercentageDiscount, 0);

    // 2) Fixed promos — apply ONCE per promo (not per item, not per qty)
    const fixedPromos = activePromos.filter((p) => p.discountType === "fixed");

    const fixedLines = [];
    let totalFixedDiscount = 0;

    for (const promo of fixedPromos) {
      let eligible = false;

      if (promo.applyTo === "all") {
        eligible = subtotal > 0;
      } else if (promo.applyTo === "specific") {
        eligible = cart.some((c) => c.itemId === promo.itemId?._id);
      }

      if (eligible) {
        const amount = Number(promo.discountValue);
        if (amount > 0) {
          totalFixedDiscount += amount;
          fixedLines.push({
            name: `${promo.promotionName} (Rs. ${amount.toLocaleString()})`,
            amount,
            type: "fixed",
          });
        }
      }
    }

    // ✅ cap fixed discount so it doesn’t go below 0
    totalFixedDiscount = Math.min(totalFixedDiscount, afterPercentage);

    const combined = [...percentageLines, ...fixedLines];

    setAppliedPromotions(combined);
  }, [cart, promotions, subtotal]);

  const totalDiscount = useMemo(() => {
    return appliedPromotions.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [appliedPromotions]);

  const finalTotal = useMemo(() => {
    return Math.max(subtotal - totalDiscount, 0);
  }, [subtotal, totalDiscount]);

  // COMPLETE SALE
  const generateInvoice = async () => {
    try {
      const res = await api.post("/sales", {
        items: cart.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const saleId = res.data.saleId;

      await api.delete("/cart/clear");
      navigate(`/InvoicePage/${saleId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Sale failed");
    }
  };

  return (
    <div className="cart-container">
      <h1>🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-table">
          {/* HEADER */}
          <div className="cart-header">
            <div className="cart-name">Item Name</div>
            <div className="cart-qty">Qty</div>
            <div className="cart-price">Price</div>
          </div>

          {/* ITEMS */}
          {cart.map((item) => (
            <div key={item.itemId} className="cart-row">
              <div className="cart-name">{item.name}</div>

              <div className="cart-qty">
                <button onClick={() => decreaseQty(item)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item)}>+</button>
              </div>

              <div className="cart-price">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          {/* SUBTOTAL */}
          <div className="cart-subtotal">
            Subtotal: Rs. {subtotal.toLocaleString()}
          </div>

          {/* PROMOS */}
          {appliedPromotions.length > 0 && (
            <div className="promo-box">
              <h3>Applied Promotions</h3>

              {appliedPromotions.map((promo, index) => (
                <div key={index} className="promo-row">
                  <span>{promo.name}</span>
                  <span>- Rs. {promo.amount.toLocaleString()}</span>
                </div>
              ))}

              <div className="promo-total">
                Total Discount: - Rs. {totalDiscount.toLocaleString()}
              </div>
            </div>
          )}

          {/* FINAL TOTAL */}
          <div className="cart-total">
            Total: Rs. {finalTotal.toLocaleString()}
          </div>

          <button className="invoice-btn" onClick={generateInvoice}>
            Complete Sale
          </button>

          <button
            className="checkout-btn"
            onClick={() => navigate("/AddSalesPage")}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}

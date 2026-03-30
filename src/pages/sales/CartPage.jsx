import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/sales/CartPageStyles.css";
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
    loadPromotions();
  }, []);

  // LOAD CART
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  };

  // 🔥 LOAD PROMOTIONS
  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load promotions");
    }
  };

  // 🔥 INCREASE QTY
  const increaseQty = async (item) => {
    try {
      await api.put("/cart/update", {
        itemId: item.itemId,
        quantity: item.quantity + 1,
      });

      loadCart();

    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // 🔥 DECREASE QTY
  const decreaseQty = async (item) => {
    try {
      const newQty = item.quantity - 1;

      if (newQty <= 0) {
        await api.delete(`/cart/remove/${item.itemId}`);
      } else {
        await api.put("/cart/update", {
          itemId: item.itemId,
          quantity: newQty,
        });
      }

      loadCart();

    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // 🔥 CALCULATIONS
  const subtotal = useMemo(() => {
    return cart.reduce((t, i) => t + i.price * i.quantity, 0);
  }, [cart]);

  const totalDiscount = useMemo(() => {
    return appliedPromotions.reduce((s, p) => s + p.amount, 0);
  }, [appliedPromotions]);

  const finalTotal = Math.max(subtotal - totalDiscount, 0);

  // 🔥 GENERATE SALE
  const generateInvoice = async () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const payload = {
        items: cart.map((i) => ({
          itemId: i.itemId || i._id,
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
        subtotal,
        discount: totalDiscount,
        total: finalTotal,
      };

      const res = await api.post("/sales", payload);

      await api.delete("/cart/clear");

      const id = res.data._id || res.data.saleId;

      if (!id) {
        toast.error("Sale created but ID missing");
        return;
      }

      toast.success("Sale completed!");

      navigate(`/sales/invoice/${id}`);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Sale failed");
    }

    setLoading(false);
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-card">

        <div className="cart-header">
          <span className="cart-badge">CHECKOUT</span>
          <h1>Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <p className="empty">Your cart is empty</p>
        ) : (
          <>
            {/* HEADER */}
            <div className="cart-row header">
              <div>Name</div>
              <div>Qty</div>
              <div>Price</div>
            </div>

            {/* ITEMS */}
            {cart.map((item) => (
              <div key={item.itemId} className="cart-row">

                <div>{item.name}</div>

                <div className="qty">
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item)}>+</button>
                </div>

                <div>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>

              </div>
            ))}

            {/* TOTALS */}
            <div className="summary">
              <div>Subtotal: Rs. {subtotal.toLocaleString()}</div>

              <div className="discount">
                Discount: - Rs. {totalDiscount.toLocaleString()}
              </div>

              <div className="final">
                Total: Rs. {finalTotal.toLocaleString()}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="cart-actions">

              <button
                className="primary"
                onClick={generateInvoice}
                disabled={loading}
              >
                {loading ? "Processing..." : "Complete Sale"}
              </button>

              <button onClick={() => navigate("/sales/add")}>
                Continue Shopping
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
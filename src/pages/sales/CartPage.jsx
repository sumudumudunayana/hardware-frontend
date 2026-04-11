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

  useEffect(() => {
    applyPromotions();
  }, [cart, promotions]);

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

  // LOAD PROMOTIONS
  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load promotions");
    }
  };

  // APPLY PROMOTIONS
  const applyPromotions = () => {
    if (!cart.length || !promotions.length) {
      setAppliedPromotions([]);
      return;
    }

    const now = new Date();

    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    let runningTotal = subtotal;
    let applied = [];

    const activePromotions = promotions.filter(
      (p) =>
        p.status === "active" &&
        new Date(p.startDate) <= now &&
        new Date(p.endDate) >= now,
    );

    const percentagePromos = activePromotions.filter(
      (p) => p.discountType === "percentage",
    );

    const fixedPromos = activePromotions.filter(
      (p) => p.discountType === "fixed",
    );

    // percentage first
    percentagePromos.forEach((promo) => {
      const amount = (runningTotal * Number(promo.discountValue)) / 100;

      if (amount > 0) {
        runningTotal -= amount;

        applied.push({
          ...promo,
          amount,
        });
      }
    });

    // fixed after percentage
    fixedPromos.forEach((promo) => {
      let amount = Number(promo.discountValue);

      if (amount > runningTotal) {
        amount = runningTotal;
      }

      if (amount > 0) {
        runningTotal -= amount;

        applied.push({
          ...promo,
          amount,
        });
      }
    });

    setAppliedPromotions(applied);
  };

  // INCREASE QTY
  const increaseQty = async (item) => {
    try {
      await api.put("/cart/update", {
        itemId: item.itemId,
        quantity: Number(item.quantity) + 1,
      });

      loadCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // DECREASE QTY
  const decreaseQty = async (item) => {
    try {
      const newQty = Number(item.quantity) - 1;

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

  // TYPE INPUT
  const updateQtyInput = (item, value) => {
    if (value === "") {
      setCart((prev) =>
        prev.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: "" } : i,
        ),
      );
      return;
    }

    const qty = Number(value);

    if (isNaN(qty) || qty < 0) return;

    setCart((prev) =>
      prev.map((i) =>
        i.itemId === item.itemId ? { ...i, quantity: value } : i,
      ),
    );
  };

  // SAVE INPUT
  const saveQtyInput = async (item) => {
    const qty = Number(item.quantity);

    if (isNaN(qty) || qty <= 0) {
      toast.error("Quantity must be greater than 0");
      loadCart();
      return;
    }

    try {
      await api.put("/cart/update", {
        itemId: item.itemId,
        quantity: qty,
      });

      loadCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // CALCULATIONS
  const subtotal = useMemo(() => {
    return cart.reduce((t, i) => t + Number(i.price) * Number(i.quantity), 0);
  }, [cart]);

  const totalDiscount = useMemo(() => {
    return appliedPromotions.reduce((s, p) => s + Number(p.amount), 0);
  }, [appliedPromotions]);

  const finalTotal = Math.max(subtotal - totalDiscount, 0);

  // GENERATE SALE
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
            <div className="cart-row header">
              <div>Name</div>
              <div>Qty</div>
              <div>Price</div>
            </div>

            {cart.map((item) => (
              <div key={item.itemId} className="cart-row">
                <div>{item.name}</div>

                <div className="qty">
                  <button onClick={() => decreaseQty(item)}>-</button>

                  <input
                    type="number"
                    min="1"
                    className="qty-input"
                    value={item.quantity}
                    onChange={(e) => updateQtyInput(item, e.target.value)}
                    onBlur={() => saveQtyInput(item)}
                  />

                  <button onClick={() => increaseQty(item)}>+</button>
                </div>

                <div>
                  Rs.{" "}
                  {(
                    Number(item.price) * Number(item.quantity)
                  ).toLocaleString()}
                </div>
              </div>
            ))}

            <div className="summary">
              <div>Subtotal: Rs. {subtotal.toLocaleString()}</div>

              {appliedPromotions.map((promo, index) => (
                <div key={index} className="discount">
                  {promo.promotionName} : - Rs.{" "}
                  {Number(promo.amount).toLocaleString()}
                </div>
              ))}

              <div className="final">
                Total: Rs. {finalTotal.toLocaleString()}
              </div>
            </div>

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

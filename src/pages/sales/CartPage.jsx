import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/CartPageStyles.css";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  //  REAL INVOICE GENERATOR
  const generateInvoice = async () => {
    try {
      const res = await axios.post("http://localhost:5500/api/sales", {
        items: cart.map((item) => ({
          itemId: item._id,
          quantity: item.qty,
          price: item.price,
        })),
      });

      const saleId = res.data.saleId;

      setCart([]);
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
          <div className="cart-header">
            <div className="cart-name">Item Name</div>
            <div className="cart-qty">Qty</div>
            <div className="cart-price">Price</div>
          </div>

          {cart.map((item) => (
            <div key={item._id} className="cart-row">
              <div className="cart-name">{item.name}</div>

              <div className="cart-qty">
                <button onClick={() => decreaseQty(item._id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>

              <div className="cart-price">
                Rs. {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}

          <div className="cart-total">
            Total: Rs. {totalPrice.toLocaleString()}
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

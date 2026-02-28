import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CartPageStyles.css";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // 🔥 INVOICE GENERATOR
  const generateInvoice = () => {
    const invoiceNumber = "INV-" + Date.now();

    const invoiceWindow = window.open("", "Invoice", "width=900,height=700");

    const invoiceContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h1 { text-align: center; }
            .header { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 10px; text-align: center; }
            th { background: #f2f2f2; }
            .total { margin-top: 20px; text-align: right; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Hardware Management System</h1>

          <div class="header">
            <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${cart
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td>Rs. ${item.price.toLocaleString()}</td>
                  <td>Rs. ${(item.price * item.qty).toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            Total: Rs. ${totalPrice.toLocaleString()}
          </div>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();

    // Optional: clear cart after invoice
    setCart([]);
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
            <div key={item.id} className="cart-row">
              <div className="cart-name">{item.name}</div>

              <div className="cart-qty">
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>

              <div className="cart-price">
                Rs. {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="cart-total">
            Total: Rs. {totalPrice.toLocaleString()}
          </div>

          {/* 🔥 GENERATE INVOICE BUTTON */}
          <button className="invoice-btn" onClick={generateInvoice}>
            Generate Invoice
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
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/sales/InvoicePageStyles.css";

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const res = await api.get(`/sales/${id}`);

        setSale(res.data);
      } catch (err) {
        console.error("Failed loading invoice", err);
      }
    };

    loadInvoice();
  }, [id]);

  if (!sale) {
    return <div className="invoice-container">Loading...</div>;
  }

  const calculatedSubtotal =
  sale.items?.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
    0
  ) || 0;

  return (
    <div className="invoice-container">
      <div className="invoice-card">
        <h1>Hardware Management System</h1>

        <h2>Invoice</h2>

        <p>
          <strong>Invoice No:</strong> {sale.invoiceNumber}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {sale.createdAt ? new Date(sale.createdAt).toLocaleString() : ""}
        </p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {sale.items?.map((item, index) => {
              const price = item.unitPrice || 0;

              const subtotal = price * item.quantity;

              return (
                <tr key={index}>
                  <td>{item.itemId?.itemName || "Unknown Item"}</td>

                  <td>{item.quantity}</td>

                  <td>Rs. {price.toLocaleString()}</td>

                  <td>Rs. {subtotal.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* SUBTOTAL */}

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              Rs. {calculatedSubtotal.toLocaleString()}
            </span>
          </div>

          {/* PROMOTIONS */}

          {sale.promotions?.length > 0 && (
            <div className="invoice-promotions">
              <h3>Applied Promotions</h3>

              {sale.promotions.map((promo, index) => (
                <div key={index} className="summary-row">
                  <span>{promo.name}</span>

                  <span>- Rs. {promo.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* DISCOUNT TOTAL */}

          {sale.discountTotal > 0 && (
            <div className="summary-row discount-row">
              <span>Total Discount</span>

              <span>- Rs. {sale.discountTotal.toLocaleString()}</span>
            </div>
          )}

          {/* FINAL TOTAL */}

          <div className="summary-row final-total">
            <span>Total</span>

            <span>
              Rs. {(sale.finalTotal || sale.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="invoice-buttons">
          <button className="print-btn" onClick={() => window.print()}>
            Print Invoice
          </button>

          <button
            className="done-btn"
            onClick={() => navigate("/CartPage", { replace: true })}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

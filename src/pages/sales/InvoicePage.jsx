import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/sales/InvoicePageStyles.css";
import { toast } from "sonner";

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const res = await api.get(`/sales/${id}`);
        setSale(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load invoice");
      }
      setLoading(false);
    };

    loadInvoice();
  }, [id]);

  // LOADING
  if (loading) {
    return <div className="invoice-wrapper">Loading...</div>;
  }

  // SAFETY
  if (!sale) {
    return <div className="invoice-wrapper">Invoice not found</div>;
  }

  // CALCULATE SUBTOTAL
  const subtotal =
    sale.items?.reduce(
      (sum, item) =>
        sum +
        (Number(item.unitPrice || item.price || 0) *
          Number(item.quantity || 0)),
      0
    ) || 0;

  const discount = sale.discountTotal || 0;

  const finalTotal =
    sale.finalTotal || sale.totalAmount || subtotal - discount;

  return (
    <div className="invoice-wrapper">
      <div className="invoice-card">

        {/* HEADER */}
        <div className="invoice-header">
          <span className="invoice-badge">INVOICE</span>
          <h1>Hardware Management</h1>
          <p>Sales Receipt</p>
        </div>

        {/* DETAILS */}
        <div className="invoice-info">
          <div>
            <strong>Invoice No:</strong> {sale.invoiceNumber || "-"}
          </div>

          <div>
            <strong>Date:</strong>{" "}
            {sale.createdAt
              ? new Date(sale.createdAt).toLocaleString()
              : "-"}
          </div>
        </div>

        {/* TABLE */}
        <div className="invoice-table">

          <div className="table-header">
            <span>Item</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Subtotal</span>
          </div>

          {sale.items?.map((item, index) => {
            const price = Number(item.unitPrice || item.price || 0);
            const qty = Number(item.quantity || 0);
            const sub = price * qty;

            return (
              <div key={index} className="table-row">
                <span>{item.itemId?.itemName || "Item"}</span>
                <span>{qty}</span>
                <span>Rs. {price.toLocaleString()}</span>
                <span>Rs. {sub.toLocaleString()}</span>
              </div>
            );
          })}

        </div>

        {/* SUMMARY */}
        <div className="invoice-summary">

          <div className="row">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="row discount">
              <span>Discount</span>
              <span>- Rs. {discount.toLocaleString()}</span>
            </div>
          )}

          <div className="row total">
            <span>Total</span>
            <span>Rs. {finalTotal.toLocaleString()}</span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="invoice-actions">

          <button
            className="print-btn"
            onClick={() => window.print()}
          >
            Print
          </button>

          <button
            className="done-btn"
            onClick={() => navigate("/sales/add", { replace: true })}
          >
            Done
          </button>

        </div>

      </div>
    </div>
  );
}
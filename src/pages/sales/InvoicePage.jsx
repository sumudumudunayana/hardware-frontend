import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/InvoicePageStyles.css";

export default function InvoicePage() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5500/api/sales/${id}`
        );
        setSale(res.data);
      } catch (err) {
        console.error("Failed loading invoice", err);
      }
    };

    loadInvoice();
  }, [id]);

  if (!sale) return <div>Loading...</div>;

  return (
    <div className="invoice-container">
      <div className="invoice-card">
        <h1>Hardware Management System</h1>
        <h2>Invoice</h2>

        <p><strong>Invoice No:</strong> {sale.invoiceNumber}</p>
        <p><strong>Date:</strong> {new Date(sale.createdAt).toLocaleString()}</p>

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
            {sale.items.map((item, index) => (
              <tr key={index}>
                <td>{item.itemId.itemName}</td>
                <td>{item.quantity}</td>
                <td>Rs. {item.price.toLocaleString()}</td>
                <td>
                  Rs. {(item.quantity * item.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total: Rs. {sale.totalAmount.toLocaleString()}</h3>

        <button onClick={() => window.print()}>
          Print Invoice
        </button>
      </div>
    </div>
  );
}
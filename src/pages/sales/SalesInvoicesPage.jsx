import React, { useEffect, useState } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../css/sales/SalesInvoicesPageStyles.css";
import { toast } from "sonner";

export default function SalesInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await api.get("/sales");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoices");
    }
  };

  const viewInvoice = async (id) => {
    try {
      const res = await api.get(`/sales/${id}`);
      setSelectedInvoice(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoice details");
    }
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadPDF = () => {
    if (!selectedInvoice) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Invoice ${selectedInvoice.invoiceNumber}`, 14, 20);

    doc.setFontSize(12);
    doc.text(
      `Date: ${new Date(selectedInvoice.createdAt).toLocaleString()}`,
      14,
      30,
    );

    doc.text(
      `Total Amount: Rs. ${selectedInvoice.totalAmount.toLocaleString()}`,
      14,
      38,
    );

    autoTable(doc, {
      startY: 50,
      head: [["Product", "Qty", "Subtotal"]],
      body:
        selectedInvoice.items?.map((item) => [
          item.itemId?.itemName || "Unknown",
          item.quantity,
          `Rs. ${item.subtotal.toLocaleString()}`,
        ]) || [],
    });

    doc.save(`${selectedInvoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="invoice-wrapper">
      <div className="invoice-card">
        <div className="invoice-header">
          <span className="invoice-badge">INVOICES</span>
          <h1>Sales Invoices</h1>
        </div>

        {/* SCROLLABLE TABLE */}
        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>Rs. {Number(invoice.totalAmount).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => viewInvoice(invoice._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {selectedInvoice && (
          <div className="invoice-modal-bg">
            <div className="invoice-modal">
              <div className="invoice-modal-header">
                <h2>{selectedInvoice.invoiceNumber}</h2>

                <button className="invoice-close-btn" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <p className="invoice-date">
                Date: {new Date(selectedInvoice.createdAt).toLocaleString()}
              </p>

              <table className="invoice-detail-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedInvoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemId?.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="invoice-total">
                Total: Rs. {selectedInvoice.totalAmount.toLocaleString()}
              </h3>

              <div className="invoice-actions">
                <button onClick={printInvoice}>Print Invoice</button>

                <button onClick={downloadPDF}>Download PDF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/sales/ManageSalesPageStyles.css";
import { toast } from "sonner";

export default function ManageSalesPage() {
  const [sales, setSales] = useState([]);
  const [expandedSaleId, setExpandedSaleId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const loadSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales");
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const toggleExpand = (id) => {
    setExpandedSaleId(expandedSaleId === id ? null : id);
  };

  const openDeleteModal = (id) => {
    setSelectedSaleId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSaleId(null);
  };

  const deleteSale = async () => {
    try {
      await toast.promise(api.delete(`/sales/${selectedSaleId}`), {
        loading: "Deleting sale...",
        success: "Sale deleted successfully!",
        error: "Delete failed!",
      });

      const updatedSales = sales.filter(
        (sale) => sale._id !== selectedSaleId
      );

      setSales(updatedSales);

      if (expandedSaleId === selectedSaleId) {
        setExpandedSaleId(null);
      }

      closeDeleteModal();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const updateSale = async (sale) => {
    const amount = Number(sale.totalAmount);

    if (
      sale.totalAmount === "" ||
      sale.totalAmount === null ||
      sale.totalAmount === undefined
    ) {
      toast.error("Total amount is required");
      return;
    }

    if (isNaN(amount)) {
      toast.error("Invalid amount");
      return;
    }

    if (amount < 0) {
      toast.error("Amount cannot be negative");
      return;
    }

    if (amount === 0) {
      toast.warning("Amount should be greater than zero");
      return;
    }

    try {
      await toast.promise(
        api.put(`/sales/${sale._id}`, {
          totalAmount: amount,
        }),
        {
          loading: "Updating sale...",
          success: "Sale updated successfully!",
          error: "Update failed!",
        }
      );

      loadSales();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manage-sales-wrapper">
      <div className="manage-sales-card">
        <div className="manage-sales-header">
          <span className="manage-sales-badge">ORDERS</span>
          <h1>Manage Orders</h1>
        </div>

        <div className="manage-sales-table-wrapper">
          <table className="manage-sales-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <React.Fragment key={sale._id}>
                  <tr>
                    <td>{sale.invoiceNumber}</td>

                    <td>{new Date(sale.createdAt).toLocaleString()}</td>

                    <td>
                      <input
                        className="manage-sales-input"
                        type="number"
                        min="0"
                        value={sale.totalAmount ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (Number(value) < 0) return;

                          setSales(
                            sales.map((s) =>
                              s._id === sale._id
                                ? {
                                    ...s,
                                    totalAmount: value,
                                  }
                                : s
                            )
                          );
                        }}
                      />
                    </td>

                    <td className="manage-sales-actions">
                      <button
                        className="manage-sales-btn-view"
                        onClick={() => toggleExpand(sale._id)}
                      >
                        {expandedSaleId === sale._id ? "Hide" : "View"}
                      </button>

                      <button
                        className="manage-sales-btn-update"
                        onClick={() => updateSale(sale)}
                      >
                        Update
                      </button>

                      <button
                        className="manage-sales-btn-delete"
                        onClick={() => openDeleteModal(sale._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedSaleId === sale._id && (
                    <tr className="manage-sales-expand-row">
                      <td colSpan="4">
                        <div className="manage-sales-expand-content">
                          {sale.items?.map((item, index) => (
                            <div
                              key={index}
                              className="manage-sales-item-box"
                            >
                              <span>{item.itemId?.itemName}</span>
                              <span>Qty: {item.quantity}</span>
                              <span>
                                Rs. {item.subtotal?.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="manage-sales-delete-overlay">
          <div className="manage-sales-delete-modal">
            <div className="manage-sales-delete-header">
              <h2>Delete Order</h2>
              <p>This action cannot be undone</p>
            </div>

            <div className="manage-sales-delete-text">
              Are you sure you want to permanently delete this order?
            </div>

            <div className="manage-sales-delete-actions">
              <button
                className="manage-sales-cancel-btn"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                className="manage-sales-confirm-btn"
                onClick={deleteSale}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
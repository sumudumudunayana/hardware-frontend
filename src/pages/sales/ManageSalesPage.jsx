import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/sales/ManageSalesPageStyles.css";
import { toast } from "sonner";

export default function ManageSalesPage() {
  const [sales, setSales] = useState([]);
  const [expanded, setExpanded] = useState(null);

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
    setExpanded(expanded === id ? null : id);
  };

  const deleteSale = async (id) => {
  try {
    await toast.promise(api.delete(`/sales/${id}`), {
      loading: "Deleting sale...",
      success: "Sale deleted successfully!",
      error: "Delete failed!",
    });

    /* instant UI update */
    const updatedSales = sales.filter((sale) => sale._id !== id);
    setSales(updatedSales);

    /* collapse expanded row if deleted */
    if (expanded === id) {
      setExpanded(null);
    }
  } catch (err) {
    console.error(err);
  }
};

  const updateSale = async (sale) => {
    const amount = Number(sale.totalAmount);

    /* VALIDATION */
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
    } catch (err) {}
  };

  return (
    <div className="sales-page-wrapper">
      <div className="sales-card">
        <div className="sales-header">
          <span className="sales-badge">ORDERS</span>
          <h1>Manage Orders</h1>
        </div>

        <div className="sales-table-wrapper">
          <table className="sales-data-table">
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
                        className="sales-amount-input"
                        type="number"
                        min="0"
                        value={sale.totalAmount ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          /* block minus typing */
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

                    <td className="sales-action-buttons">
                      <button
                        className="sales-btn-view"
                        onClick={() => toggleExpand(sale._id)}
                      >
                        {expanded === sale._id ? "Hide" : "View"}
                      </button>

                      <button
                        className="sales-btn-update"
                        onClick={() => updateSale(sale)}
                      >
                        Update
                      </button>

                      <button
                        className="sales-btn-delete"
                        onClick={() => deleteSale(sale._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expanded === sale._id && (
                    <tr className="sales-expand-row">
                      <td colSpan="4">
                        <div className="sales-expand-content">
                          {sale.items?.map((item, index) => (
                            <div
                              key={index}
                              className="sales-item-box"
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
    </div>
  );
}
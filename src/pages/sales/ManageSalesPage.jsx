import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageSalesPageStyles.css";

export default function ManageSalesPage() {
  const [sales, setSales] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadSales = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Failed loading sales", err);
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
      await axios.delete(`http://localhost:5500/api/sales/${id}`);
      setAlert("Sale deleted successfully");
      loadSales();
    } catch (err) {
      setAlert("Failed to delete sale");
    }
    setTimeout(() => setAlert(null), 2500);
  };

  const updateSale = async (sale) => {
    try {
      await axios.put(
        `http://localhost:5500/api/sales/${sale._id}`,
        { totalAmount: sale.totalAmount }
      );
      setAlert("Sale updated successfully");
      loadSales();
    } catch (err) {
      setAlert("Update failed");
    }
    setTimeout(() => setAlert(null), 2500);
  };

  return (
    <div className="ms-container">
      <div className="ms-overlay"></div>

      <div className="ms-card">
        <h1>Manage Sales</h1>

        {alert && <div className="ms-alert">{alert}</div>}

        <div className="ms-table-wrapper">
          <table className="ms-table">
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
                    <td>
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td>
                      Rs.{" "}
                      <input
                        type="number"
                        value={sale.totalAmount}
                        onChange={(e) =>
                          setSales(
                            sales.map((s) =>
                              s._id === sale._id
                                ? { ...s, totalAmount: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </td>
                    <td className="ms-actions">
                      <button
                        className="expand-btn"
                        onClick={() => toggleExpand(sale._id)}
                      >
                        {expanded === sale._id ? "Hide" : "View"}
                      </button>

                      <button
                        className="update-btn"
                        onClick={() => updateSale(sale)}
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteSale(sale._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expanded === sale._id && (
                    <tr className="expand-row">
                      <td colSpan="4">
                        <div className="expand-content">
                          {sale.items?.map((item, index) => (
                            <div key={index} className="ms-item-box">
                              <strong>{item.itemId?.itemName}</strong>
                              <span>Qty: {item.quantity}</span>
                              <span>
                                Rs. {item.subtotal.toLocaleString()}
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
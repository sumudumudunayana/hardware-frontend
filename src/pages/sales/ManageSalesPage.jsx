import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/sales/ManageSalesPageStyles.css";

export default function ManageSalesPage() {
  const [sales, setSales] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

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
      setAlert({ show: true, type: "success", message: "Sale deleted" });
      loadSales();
    } catch {
      setAlert({ show: true, type: "error", message: "Delete failed" });
    }
    setTimeout(() => setAlert({ show: false }), 2500);
  };

  const updateSale = async (sale) => {
    try {
      await axios.put(
        `http://localhost:5500/api/sales/${sale._id}`,
        { totalAmount: Number(sale.totalAmount) }
      );
      setAlert({ show: true, type: "success", message: "Sale updated" });
      loadSales();
    } catch {
      setAlert({ show: true, type: "error", message: "Update failed" });
    }
    setTimeout(() => setAlert({ show: false }), 2500);
  };

  return (
    <div className="sales-page-wrapper">
      <div className="sales-card">

        <div className="sales-header">
          <span className="sales-badge">ORDERS</span>
          <h1>Manage Orders</h1>
          <p>View, update, and manage all sales records</p>
        </div>

        {alert.show && (
          <div className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        )}

        <div className="table-wrapper">
          <table className="sales-table">
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

                    <td className="actions">
                      <button onClick={() => toggleExpand(sale._id)}>
                        {expanded === sale._id ? "Hide" : "View"}
                      </button>

                      <button
                        className="update"
                        onClick={() => updateSale(sale)}
                      >
                        Update
                      </button>

                      <button
                        className="delete"
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
                            <div key={index} className="item-box">
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
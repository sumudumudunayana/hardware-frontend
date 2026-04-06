import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/stock/ManageStockPageStyles.css";

export default function ManageStockPage() {
  const [stocks, setStocks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    itemName: "",
    quantity: "",
    updatedAt: "",
  });

  const loadStocks = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load stock data");
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) {
      setFiltered(stocks);
      return;
    }

    setFiltered(
      stocks.filter(
        (s) =>
          s.itemId?.itemName.toLowerCase().includes(key) ||
          s.stockId.toString() === key
      )
    );
  };

  const openModal = (stock) => {
    setEditData({
      _id: stock._id,
      itemName: stock.itemId?.itemName,
      quantity: stock.quantity,
      updatedAt: stock.updatedAt
        ? new Date(stock.updatedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });

    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity" && Number(value) < 0) return;

    setEditData({
      ...editData,
      [name]: value,
    });
  };

  // UPDATE STOCK
  const updateStock = async () => {
    const qty = Number(editData.quantity);

    if (editData.quantity === "") {
      toast.error("Quantity is required");
      return;
    }

    if (qty < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    try {
      const payload = {
        quantity: qty,
        updatedAt: editData.updatedAt,
      };

      await toast.promise(
        api.put(`/stocks/${editData._id}`, payload),
        {
          loading: "Updating stock...",
          success: "Stock updated successfully!",
          error: "Stock update failed",
        }
      );

      const updatedList = stocks.map((s) =>
        s._id === editData._id
          ? {
              ...s,
              quantity: qty,
              updatedAt: editData.updatedAt,
            }
          : s
      );

      setStocks(updatedList);
      setFiltered(updatedList);

      setShowModal(false);
    } catch {}
  };

  // REMOVE STOCK
  const removeStock = async (stockId) => {
    try {
      const today = new Date().toISOString();

      await toast.promise(
        api.put(`/stocks/${stockId}`, {
          quantity: 0,
          updatedAt: today,
        }),
        {
          loading: "Removing stock...",
          success: "Stock removed successfully!",
          error: "Failed to remove stock",
        }
      );

      const updatedList = stocks.map((s) =>
        s._id === stockId
          ? {
              ...s,
              quantity: 0,
              updatedAt: today,
            }
          : s
      );

      setStocks(updatedList);
      setFiltered(updatedList);
    } catch {}
  };

  return (
    <div className="stkmg-wrapper">
      <div className="stkmg-card">
        <div className="stkmg-header">
          <span className="stkmg-badge">STOCK</span>
          <h1>Manage Stock</h1>
        </div>

        <input
          className="stkmg-search"
          placeholder="Search by item or stock ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        <div className="stkmg-table-wrapper">
          <table className="stkmg-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Company</th>
                <th>Distributor</th>
                <th>Qty</th>
                <th>Last Update</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.stockId}</td>
                  <td>{stock.itemId?.itemName}</td>
                  <td>{stock.itemId?.itemCategory}</td>
                  <td>{stock.itemId?.itemCompany}</td>
                  <td>{stock.itemId?.itemDistributor}</td>
                  <td>{stock.quantity}</td>

                  <td>
                    {stock.updatedAt
                      ? new Date(stock.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="stkmg-actions">
                    <button
                      className="stkmg-update-btn"
                      onClick={() => openModal(stock)}
                    >
                      Update
                    </button>

                    <button
                      className="stkmg-remove-btn"
                      onClick={() => removeStock(stock._id)}
                    >
                      Remove Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="stkmg-modal-bg">
          <div className="stkmg-modal-box">
            <h2>Update Stock</h2>

            <p className="stkmg-item">{editData.itemName}</p>

            <label>Quantity</label>
            <input
              type="number"
              min="0"
              name="quantity"
              value={editData.quantity}
              onChange={handleChange}
            />

            <label>Last Updated Date</label>
            <input
              type="date"
              name="updatedAt"
              value={editData.updatedAt}
              onChange={handleChange}
            />

            <div className="stkmg-modal-actions">
              <button className="stkmg-btn-cancel" onClick={closeModal}>
                Cancel
              </button>

              <button className="stkmg-btn-primary" onClick={updateStock}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
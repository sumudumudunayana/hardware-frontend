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

    if (!key.trim()) return setFiltered(stocks);

    setFiltered(
      stocks.filter(
        (s) =>
          s.itemId?.itemName.toLowerCase().includes(key) ||
          s.stockId.toString() === key,
      ),
    );
  };

  const openModal = (stock) => {
    setEditData({
      _id: stock._id,
      itemName: stock.itemId?.itemName,
      quantity: stock.quantity,
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const value = e.target.value;

    //  Prevent negative typing
    if (Number(value) < 0) return;

    setEditData({
      ...editData,
      quantity: value,
    });
  };

  //  UPDATE WITH VALIDATION + TOAST
  const updateStock = async () => {
    const qty = Number(editData.quantity);

    // Validation
    if (editData.quantity === "") {
      toast.error("Quantity is required");
      return;
    }

    if (qty < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    // Optional UX
    if (qty === 0) {
      toast.warning("Stock set to zero", {
        description: "Item will be marked as out of stock",
      });
    }

    try {
      await toast.promise(
        api.put(`/stocks/${editData._id}`, { quantity: qty }),
        {
          loading: "Updating stock...",
          success: "Stock updated successfully!",
          error: "Stock update failed",
        },
      );

      //  Instant UI update (no reload delay)
      const updatedList = stocks.map((s) =>
        s._id === editData._id ? { ...s, quantity: qty } : s,
      );

      setStocks(updatedList);
      setFiltered(updatedList);

      setShowModal(false);
    } catch {}
  };

  return (
    <div className="stkmg-wrapper">
      <div className="stkmg-card">
        {/* HEADER */}
        <div className="stkmg-header">
          <span className="stkmg-badge">STOCK</span>
          <h1>Manage Stock</h1>
        </div>

        {/* SEARCH */}
        <input
          className="stkmg-search"
          placeholder="Search by item or stock ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        {/* TABLE */}
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

                  <td>
                    <button
                      className="stkmg-update-btn"
                      onClick={() => openModal(stock)}
                    >
                      Update
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

            <input
              type="number"
              min="0"
              name="quantity"
              value={editData.quantity}
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

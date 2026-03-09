import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/stock/ManageStockPageStyles.css";

export default function ManageStockPage() {

  const [stocks, setStocks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    itemName: "",
    quantity: ""
  });

  const [alert, setAlert] = useState({ show: false, message: "" });

  const loadStocks = async () => {

    try {

      const res = await axios.get("http://localhost:5500/api/stocks");

      setStocks(res.data);
      setFiltered(res.data);

    } catch (err) {

      console.error("Failed loading stocks", err);

    }

  };

  useEffect(() => {
    loadStocks();
  }, []);

  const autoSearch = (text) => {

    const keyword = text.toLowerCase();

    if (!keyword.trim()) {
      setFiltered(stocks);
      return;
    }

    const result = stocks.filter((s) =>
      s.itemId?.itemName.toLowerCase().includes(keyword) ||
      s.stockId.toString() === keyword
    );

    setFiltered(result);

  };

  const openModal = (stock) => {

    setEditData({
      _id: stock._id,
      itemName: stock.itemId?.itemName,
      quantity: stock.quantity
    });

    setShowModal(true);

  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {

    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });

  };

  const updateStock = async () => {

    try {

      await axios.put(
        `http://localhost:5500/api/stocks/${editData._id}`,
        {
          quantity: Number(editData.quantity)
        }
      );

      setAlert({ show: true, message: "Stock updated successfully" });

      loadStocks();

      setShowModal(false);

    } catch (err) {

      setAlert({ show: true, message: "Stock update failed" });

    }

    setTimeout(() => setAlert({ show: false }), 2500);

  };

  return (

    <div className="manage-stock-bg">

      <div className="manage-stock-overlay"></div>

      <div className="manage-stock-container">

        <h1 className="manage-stock-title">Manage Stock</h1>

        {alert.show && (
          <div className="alert-box">{alert.message}</div>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by item name or stock ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>

        <div className="table-wrapper">

          <table className="stock-table">

            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Company</th>
                <th>Distributor</th>
                <th>Current Qty</th>
                <th>Last Delivery</th>
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
                      className="update-btn"
                      onClick={() => openModal(stock)}
                    >
                      Update Qty
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showModal && (

        <div className="modal-bg">

          <div className="modal-box">

            <h2>Update Stock</h2>

            <p>{editData.itemName}</p>

            <input
              type="number"
              name="quantity"
              value={editData.quantity}
              onChange={handleChange}
            />

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={updateStock}
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
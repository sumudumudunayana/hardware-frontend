import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageStockPageStyles.css";

export default function ManageStockPage() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [editQuantity, setEditQuantity] = useState({});
  const [alert, setAlert] = useState(null);

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
    if (!keyword.trim()) return setFiltered(stocks);

    const result = stocks.filter(
      (s) =>
        s.itemId?.itemName.toLowerCase().includes(keyword) ||
        s.stockId.toString() === keyword
    );
    setFiltered(result);
  };

  const handleQuantityChange = (id, value) => {
    setEditQuantity({ ...editQuantity, [id]: value });
  };

  const updateStock = async (id) => {
    try {
      await axios.put(
        `http://localhost:5500/api/stocks/${id}`,
        {
          quantity: Number(editQuantity[id])
        }
      );

      setAlert("Stock updated successfully!");
      loadStocks();
    } catch (err) {
      setAlert("Failed to update stock!");
    }

    setTimeout(() => setAlert(null), 2500);
  };

  return (
    <div className="stock-bg">
      <div className="stock-overlay"></div>

      <div className="stock-container">
        <h1 className="stock-title">Stock Management</h1>

        {alert && <div className="alert-box">{alert}</div>}

        <div className="stock-search">
          <input
            type="text"
            placeholder="Search by Stock ID or Item Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>

        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>Current Quantity</th>
                <th>Update Quantity</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.stockId}</td>
                  <td>{stock.itemId?.itemName}</td>
                  <td>{stock.itemId?.itemCategory}</td>
                  <td>{stock.itemId?.itemSellingPrice}</td>
                  <td>{stock.quantity}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="New quantity"
                      value={editQuantity[stock._id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(stock._id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="update-stock-btn"
                      onClick={() => updateStock(stock._id)}
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
    </div>
  );
}
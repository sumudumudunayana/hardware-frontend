import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/stock/AddStockPageStyles.css";

export default function AddStockPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    itemId: "",
    quantity: "",
    arrivalDate: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/items");
      setItems(res.data);
    } catch (err) {
      console.error("Item loading error", err);
    }
  };

  const handleItemChange = (e) => {
    const id = e.target.value;

    const item = items.find((i) => i._id === id);

    setSelectedItem(item);

    setFormData({
      ...formData,
      itemId: id,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5500/api/stocks", {
        itemId: formData.itemId,
        quantity: Number(formData.quantity),
        arrivalDate: formData.arrivalDate,
      });

      alert("Stock Added Successfully");

      setFormData({
        itemId: "",
        quantity: "",
        arrivalDate: "",
      });

      setSelectedItem(null);
    } catch (err) {
      console.error(err);

      alert("Failed to add stock");
    }
  };

  return (
    <div className="add-stock-container">
      <div className="add-stock-overlay"></div>

      <div className="add-stock-card">
        <h1 className="add-stock-title">Add Stock</h1>

        <form className="add-stock-form" onSubmit={handleSubmit}>
          {/* ITEM SELECT */}

          <select
            name="itemId"
            value={formData.itemId}
            onChange={handleItemChange}
            required
          >
            <option value="">Select Item</option>

            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.itemName}
              </option>
            ))}
          </select>

          {/* ITEM DETAILS */}

          {selectedItem && (
            <div className="stock-details">
              <div className="detail-box">
                <label>Category</label>
                <input value={selectedItem.itemCategory} readOnly />
              </div>

              <div className="detail-box">
                <label>Company</label>
                <input value={selectedItem.itemCompany} readOnly />
              </div>

              <div className="detail-box">
                <label>Distributor</label>
                <input value={selectedItem.itemDistributor} readOnly />
              </div>
            </div>
          )}

          {/* QUANTITY */}

          <input
            type="number"
            name="quantity"
            placeholder="Stock Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          {/* ARRIVAL DATE */}

          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
          />

          <button className="add-stock-btn">Add Stock</button>
        </form>
      </div>
    </div>
  );
}

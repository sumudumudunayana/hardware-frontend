import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
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
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load items");
    }
  };

  const handleItemChange = (e) => {
    const id = e.target.value;
    const item = items.find((i) => i._id === id);

    setSelectedItem(item || null);
    setFormData({ ...formData, itemId: id });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity" && Number(value) < 0) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { itemId, quantity, arrivalDate } = formData;
    const qty = Number(quantity);

    if (!itemId) {
      toast.error("Please select an item");
      return;
    }

    if (!quantity || qty <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (!arrivalDate) {
      toast.error("Please select arrival date");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (arrivalDate > today) {
      toast.warning("Arrival date cannot be in the future");
      return;
    }

    try {
      await toast.promise(
        api.post("/stocks", {
          itemId,
          quantity: qty,
          arrivalDate,
        }),
        {
          loading: "Adding stock...",
          success: "Stock added successfully!",
          error: "Failed to add stock",
        }
      );

      setFormData({
        itemId: "",
        quantity: "",
        arrivalDate: "",
      });

      setSelectedItem(null);
    } catch (err) {}
  };

  return (
    <div className="add-stock-page-wrapper">
      <div className="add-stock-page-card">

        <div className="add-stock-page-header">
          <span className="add-stock-page-badge">STOCK</span>
          <h1>Add Stock</h1>
        </div>

        <form
          className="add-stock-page-form"
          onSubmit={handleSubmit}
        >
          <select
            name="itemId"
            value={formData.itemId}
            onChange={handleItemChange}
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.itemName}
              </option>
            ))}
          </select>

          {selectedItem && (
            <div className="add-stock-page-details">
              <div className="add-stock-page-detail-box">
                <label>Category</label>
                <input
                  value={selectedItem.itemCategory}
                  readOnly
                />
              </div>

              <div className="add-stock-page-detail-box">
                <label>Company</label>
                <input
                  value={selectedItem.itemCompany}
                  readOnly
                />
              </div>

              <div className="add-stock-page-detail-box">
                <label>Distributor</label>
                <input
                  value={selectedItem.itemDistributor}
                  readOnly
                />
              </div>
            </div>
          )}

          <input
            type="number"
            name="quantity"
            placeholder="Stock Quantity"
            value={formData.quantity}
            onChange={handleChange}
          />

          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
          />

          <button className="add-stock-page-btn">
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AddPromotionPageStyles.css";

export default function AddPromotionPage() {
  const [formData, setFormData] = useState({
    promotionName: "",
    promotionDescription: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    applyTo: "all",
    itemId: "",
    status: "active",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/items");
        setItems(res.data);
      } catch (err) {
        console.error("Failed loading items", err);
      }
    };
    loadItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
      };

      await axios.post("http://localhost:5500/api/promotions", payload);

      alert("Promotion created successfully!");

      setFormData({
        promotionName: "",
        promotionDescription: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        applyTo: "all",
        itemId: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error creating promotion:", error.response?.data);
      alert("Failed to create promotion.");
    }
  };

  return (
    <div className="add-promo-container">
      <div className="add-promo-overlay"></div>

      <div className="add-promo-card">
        <h1 className="add-promo-title">Add New Promotion</h1>

        <form className="add-promo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="promotionName"
            placeholder="Promotion Name"
            value={formData.promotionName}
            onChange={handleChange}
            required
          />

          <textarea
            name="promotionDescription"
            placeholder="Promotion Description"
            value={formData.promotionDescription}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>

            <input
              type="number"
              name="discountValue"
              placeholder="Discount Value"
              value={formData.discountValue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <select
              name="applyTo"
              value={formData.applyTo}
              onChange={handleChange}
            >
              <option value="all">All Items</option>
              <option value="specific">Specific Item</option>
            </select>

            {formData.applyTo === "specific" && (
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                required
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit" className="add-promo-btn">
            Create Promotion
          </button>
        </form>
      </div>
    </div>
  );
}

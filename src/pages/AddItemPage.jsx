import React, { useState } from "react";
import axios from "axios";
import "../css/AddItemPageStyles.css";

export default function AddItemPage() {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    itemCategory: "",
    itemCostPrice: "",
    itemSellingPrice: "",
    itemLabeledPrice: "",
    itemCompany: "",
    itemDistributor: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/item/add-item",  // <-- update if your endpoint differs
        formData
      );

      alert("Item Added Successfully!");
      console.log(response.data);

      // Reset form
      setFormData({
        itemName: "",
        itemDescription: "",
        itemCategory: "",
        itemCostPrice: "",
        itemSellingPrice: "",
        itemLabeledPrice: "",
        itemCompany: "",
        itemDistributor: "",
      });

    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Check console.");
    }
  };

  return (
    <div className="add-item-container">
      <div className="add-item-overlay"></div>

      <div className="add-item-card">
        <h1 className="add-item-title">Add New Item</h1>

        <form className="add-item-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={formData.itemName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="itemCategory"
              placeholder="Category"
              value={formData.itemCategory}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="itemDescription"
            placeholder="Item Description"
            value={formData.itemDescription}
            onChange={handleChange}
            required
          ></textarea>

          <div className="form-row">
            <input
              type="number"
              name="itemCostPrice"
              placeholder="Cost Price"
              value={formData.itemCostPrice}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="itemSellingPrice"
              placeholder="Selling Price"
              value={formData.itemSellingPrice}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="number"
            name="itemLabeledPrice"
            placeholder="Labeled Price"
            value={formData.itemLabeledPrice}
            onChange={handleChange}
          />

          <div className="form-row">
            <input
              type="text"
              name="itemCompany"
              placeholder="Company"
              value={formData.itemCompany}
              onChange={handleChange}
            />

            <input
              type="text"
              name="itemDistributor"
              placeholder="Distributor"
              value={formData.itemDistributor}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="add-item-btn">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}

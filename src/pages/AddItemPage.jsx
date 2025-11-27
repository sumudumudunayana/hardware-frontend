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

  // Dummy dropdown values — replace with API values when ready
  const categories = ["Electronics", "Tools", "Household", "Plumbing", "Electrical"];
  const companies = ["Singer", "Abans", "Softlogic", "Damro", "Panasonic"];
  const distributors = ["Local", "Mega Trade", "Hardware Supply", "Ceylon Distributors"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/item/add-item", formData);

      alert("Item Added Successfully!");

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
      alert("Failed to add item.");
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

            {/* Category Select */}
            <select
              name="itemCategory"
              value={formData.itemCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <textarea
            name="itemDescription"
            placeholder="Item Description"
            value={formData.itemDescription}
            onChange={handleChange}
            required
          />

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

            {/* Company Select */}
            <select
              name="itemCompany"
              value={formData.itemCompany}
              onChange={handleChange}
            >
              <option value="">Select Company</option>
              {companies.map((com, index) => (
                <option key={index} value={com}>{com}</option>
              ))}
            </select>

            {/* Distributor Select */}
            <select
              name="itemDistributor"
              value={formData.itemDistributor}
              onChange={handleChange}
            >
              <option value="">Select Distributor</option>
              {distributors.map((dist, index) => (
                <option key={index} value={dist}>{dist}</option>
              ))}
            </select>

          </div>

          <button type="submit" className="add-item-btn">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}

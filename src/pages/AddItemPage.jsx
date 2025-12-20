import React, { useState, useEffect } from "react";
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

  // 🔥 These will be filled from backend
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [distributors, setDistributors] = useState([]);

  // Fetch dropdown data
  const loadDropdownData = async () => {
    try {
      const [catRes, comRes, distRes] = await Promise.all([
        axios.get("http://localhost:8080/category/get-all"),
        axios.get("http://localhost:8080/company/get-all"),
        axios.get("http://localhost:8080/distributor/get-all"),
      ]);

      setCategories(catRes.data);
      setCompanies(comRes.data);
      setDistributors(distRes.data);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
      alert("Failed to load dropdown data!");
    }
  };

  useEffect(() => {
    loadDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/item/add-item", formData);

      alert("Item Added Successfully!");

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

            {/* Category from DB */}
            <select
              name="itemCategory"
              value={formData.itemCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
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
            {/* Company from DB */}
            <select
              name="itemCompany"
              value={formData.itemCompany}
              onChange={handleChange}
            >
              <option value="">Select Company</option>

              {companies.map((com) => (
                <option key={com.id} value={com.companyName}>
                  {com.companyName}
                </option>
              ))}
            </select>

            {/* Distributor from DB */}
            <select
              name="itemDistributor"
              value={formData.itemDistributor}
              onChange={handleChange}
            >
              <option value="">Select Distributor</option>

              {distributors.map((dist) => (
                <option key={dist.id} value={dist.distributorName}>
                  {dist.distributorName}
                </option>
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

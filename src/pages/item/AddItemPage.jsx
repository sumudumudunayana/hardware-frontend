import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../../css/item/AddItemPageStyles.css";

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

  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [catRes, comRes, distRes] = await Promise.all([
          axios.get("http://localhost:5500/api/categories"),
          axios.get("http://localhost:5500/api/companies"),
          axios.get("http://localhost:5500/api/distributors"),
        ]);
        setCategories(catRes.data);
        setCompanies(comRes.data);
        setDistributors(distRes.data);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };

    loadDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = [];

  //  Field validations
  if (!formData.itemName.trim()) errors.push("Item name is required");
  if (!formData.itemCategory) errors.push("Please select a category");
  if (!formData.itemDescription.trim()) errors.push("Item description is required");
  if (!formData.itemCostPrice) errors.push("Cost price is required");
  if (!formData.itemSellingPrice) errors.push("Selling price is required");
  if (!formData.itemLabeledPrice) errors.push("Labeled price is required");
  if (!formData.itemCompany) errors.push("Please select a company");
  if (!formData.itemDistributor) errors.push("Please select a supplier");

  //  Show all errors
  if (errors.length > 0) {
    errors.forEach((err) => toast.error(err));
    return;
  }

  const cost = Number(formData.itemCostPrice);
  const selling = Number(formData.itemSellingPrice);
  const labeled = Number(formData.itemLabeledPrice);

  //  Price validations
  if (cost < 0 || selling < 0 || labeled < 0) {
    toast.error("Prices cannot be negative");
    return;
  }

  if (selling < cost) {
    toast.warning("Selling price should be higher than cost price");
    return;
  }

  try {
    const payload = {
      ...formData,
      itemCostPrice: cost,
      itemSellingPrice: selling,
      itemLabeledPrice: labeled,
    };

    await axios.post("http://localhost:5500/api/items", payload);

    toast.success("Item added successfully!");

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
    toast.error("Failed to add item");
  }
};

  return (
    <div className="add-item-wrapper">
      <div className="add-item-card">

        <div className="add-item-header">
          <span className="add-item-badge">PRODUCT MANAGEMENT</span>
          <h1>Add New Item</h1>
          <p>Register a new hardware product into inventory</p>
        </div>

        <form className="add-item-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={formData.itemName}
              onChange={handleChange}
            />

            <select
              name="itemCategory"
              value={formData.itemCategory}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
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
          />

          <div className="form-row">
            <input
              type="number"
              name="itemCostPrice"
              placeholder="Cost Price"
              value={formData.itemCostPrice}
              onChange={handleChange}
            />

            <input
              type="number"
              name="itemSellingPrice"
              placeholder="Selling Price"
              value={formData.itemSellingPrice}
              onChange={handleChange}
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
            <select
              name="itemCompany"
              value={formData.itemCompany}
              onChange={handleChange}
            >
              <option value="">Select Company</option>
              {companies.map((com) => (
                <option key={com._id} value={com.companyName}>
                  {com.companyName}
                </option>
              ))}
            </select>

            <select
              name="itemDistributor"
              value={formData.itemDistributor}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>
              {distributors.map((dist) => (
                <option key={dist._id} value={dist.distributorName}>
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
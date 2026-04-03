import React, { useState, useEffect } from "react";
import api from "../../services/api";
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
          api.get("/categories"),
          api.get("/companies"),
          api.get("/distributors"),
        ]);

        setCategories(catRes.data);
        setCompanies(comRes.data);
        setDistributors(distRes.data);

      } catch (error) {
        toast.error("Failed to load dropdown data");
      }
    };

    loadDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // item name validation while typing
    if (name === "itemName") {
      // letters + numbers + spaces only
      if (!/^[A-Za-z0-9\s]*$/.test(value)) {
        toast.error(
          "Item name can contain only letters, numbers, and spaces"
        );
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    const itemName = formData.itemName.trim();

    // item name validation
    if (!itemName) {
      errors.push("Item name is required");
    } else if (!/^[A-Za-z0-9\s]+$/.test(itemName)) {
      errors.push(
        "Item name can contain only letters, numbers, and spaces"
      );
    } else if (/^\d+$/.test(itemName)) {
      errors.push("Item name cannot contain only numbers");
    }

    // required fields
    if (!formData.itemCategory)
      errors.push("Please select a category");

    if (!formData.itemDescription.trim())
      errors.push("Item description is required");

    if (!formData.itemCostPrice)
      errors.push("Cost price is required");

    if (!formData.itemSellingPrice)
      errors.push("Selling price is required");

    if (!formData.itemLabeledPrice)
      errors.push("Labeled price is required");

    if (!formData.itemCompany)
      errors.push("Please select a company");

    if (!formData.itemDistributor)
      errors.push("Please select a supplier");

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    const cost = Number(formData.itemCostPrice);
    const selling = Number(formData.itemSellingPrice);
    const labeled = Number(formData.itemLabeledPrice);

    // price validations
    if (cost < 0 || selling < 0 || labeled < 0) {
      toast.error("Prices cannot be negative");
      return;
    }

    if (selling <= cost) {
      toast.error(
        "Selling price must be greater than cost price"
      );
      return;
    }

    if (labeled <= selling || labeled <= cost) {
      toast.error(
        "Labeled price must be greater than selling and cost price"
      );
      return;
    }

    try {
      const payload = {
        ...formData,
        itemName: itemName,
        itemCostPrice: cost,
        itemSellingPrice: selling,
        itemLabeledPrice: labeled,
      };

      await toast.promise(
        api.post("/items", payload),
        {
          loading: "Adding item...",
          success: "Item added successfully!",
          error: (err) =>
            err.response?.data?.message ||
            "Failed to add item",
        }
      );

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
      toast.error(
        error.response?.data?.message ||
        "Failed to add item"
      );
    }
  };

  return (
    <div className="add-item-wrapper">
      <div className="add-item-card">
        <div className="add-item-header">
          <span className="add-item-badge">
            PRODUCT MANAGEMENT
          </span>
          <h1>Add New Item</h1>
        </div>

        <form
          className="add-item-form"
          onSubmit={handleSubmit}
        >
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
                <option
                  key={cat._id}
                  value={cat.categoryName}
                >
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
                <option
                  key={com._id}
                  value={com.companyName}
                >
                  {com.companyName}
                </option>
              ))}
            </select>

            <select
              name="itemDistributor"
              value={formData.itemDistributor}
              onChange={handleChange}
            >
              <option value="">
                Select Supplier
              </option>
              {distributors.map((dist) => (
                <option
                  key={dist._id}
                  value={dist.distributorName}
                >
                  {dist.distributorName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="add-item-btn"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
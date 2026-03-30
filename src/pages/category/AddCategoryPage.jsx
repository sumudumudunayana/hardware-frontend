import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/category/AddCategoryPageStyles.css";

export default function AddCategoryPage() {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect all errors
    const errors = [];

    if (!formData.categoryName.trim()) {
      errors.push("Category name is required");
    }

    if (!formData.categoryDescription.trim()) {
      errors.push("Category description is required");
    }

    //  Show all errors at once
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await toast.promise(
        api.post("/categories", formData),
        {
          loading: "Adding category...",
          success: "Category added successfully!",
          error: "Failed to add category",
        }
      );

      setFormData({
        categoryName: "",
        categoryDescription: "",
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-category-wrapper">
      <div className="add-category-card">

        <div className="add-category-header">
          <span className="add-category-badge">CATEGORY MODULE</span>
          <h1>Add New Category</h1>
        </div>

        <form className="add-category-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            value={formData.categoryName}
            onChange={handleChange}
          />

          <textarea
            name="categoryDescription"
            placeholder="Category Description"
            value={formData.categoryDescription}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="add-category-btn">
            Add Category
          </button>

        </form>
      </div>
    </div>
  );
}
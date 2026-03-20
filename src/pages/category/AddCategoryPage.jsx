import React, { useState } from "react";
import axios from "axios";
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
    try {
      await axios.post("http://localhost:5500/api/categories", formData);
      alert("Category Added Successfully!");
      setFormData({
        categoryName: "",
        categoryDescription: "",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  return (
    <div className="add-category-wrapper">
      <div className="add-category-card">

        <div className="add-category-header">
          <span className="add-category-badge">CATEGORY MODULE</span>
          <h1>Add New Category</h1>
          <p>Create and organize product categories</p>
        </div>

        <form className="add-category-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            value={formData.categoryName}
            onChange={handleChange}
            required
          />

          <textarea
            name="categoryDescription"
            placeholder="Category Description"
            value={formData.categoryDescription}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="add-category-btn">
            Add Category
          </button>

        </form>
      </div>
    </div>
  );
}
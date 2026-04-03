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
    const { name, value } = e.target;

    // category name → letters and spaces only
    if (name === "categoryName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        toast.error(
          "Category name can contain only letters and spaces"
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
    const categoryName = formData.categoryName.trim();
    const categoryDescription =
      formData.categoryDescription.trim();

    // name validation
    if (!categoryName) {
      errors.push("Category name is required");
    } else if (!/^[A-Za-z\s]+$/.test(categoryName)) {
      errors.push(
        "Category name can contain only letters and spaces"
      );
    } else if (categoryName.length < 3) {
      errors.push(
        "Category name must be at least 3 characters"
      );
    }

    // description validation
    if (!categoryDescription) {
      errors.push(
        "Category description is required"
      );
    }

    if (errors.length > 0) {
      errors.forEach((err) =>
        toast.error(err)
      );
      return;
    }

    try {
      await toast.promise(
        api.post("/categories", {
          categoryName,
          categoryDescription,
        }),
        {
          loading: "Adding category...",
          success:
            "Category added successfully!",
          error: (err) =>
            err.response?.data?.message ||
            "Failed to add category",
        }
      );

      setFormData({
        categoryName: "",
        categoryDescription: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add category"
      );
    }
  };

  return (
    <div className="add-category-wrapper">
      <div className="add-category-card">
        <div className="add-category-header">
          <span className="add-category-badge">
            CATEGORY MODULE
          </span>
          <h1>Add New Category</h1>
        </div>

        <form
          className="add-category-form"
          onSubmit={handleSubmit}
        >
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
            value={
              formData.categoryDescription
            }
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="add-category-btn"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}
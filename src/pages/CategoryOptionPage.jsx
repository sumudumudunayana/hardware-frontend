import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CategoryOptionPageStyles.css";

export default function CategoryOptionPage() {
  const navigate = useNavigate();

  return (
    <div className="category-container">
      <div className="category-overlay"></div>

      <div className="category-card">
        <h1 className="category-title">Category Management</h1>

        <div className="category-grid">

          <div
            className="category-box"
            onClick={() => navigate("/AddCategoryPage")}
          >
            <h2>Add Category</h2>
            <p>Create and register new item categories.</p>
          </div>

          <div
            className="category-box"
            onClick={() => navigate("/ManageCategoryPage")}
          >
            <h2>Manage Categories</h2>
            <p>View, update, and delete all categories.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

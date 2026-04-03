import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/category/ManageCategoryPageStyles.css";

export default function ManageCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({
    _id: "",
    categoryName: "",
    categoryDescription: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) {
      setFiltered(categories);
      return;
    }

    const result = categories.filter(
      (category) =>
        category.categoryName.toLowerCase().includes(key) ||
        category._id.toString() === key,
    );

    setFiltered(result);
  };

  const openUpdateModal = (category) => {
    setEditData(category);
    setShowUpdateModal(true);
  };

  // UPDATE
  const submitUpdate = async () => {
    const categoryName = editData.categoryName?.trim();
    const categoryDescription = editData.categoryDescription?.trim();

    // validation
    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(categoryName)) {
      toast.error("Category name can contain only letters and spaces");
      return;
    }

    if (categoryName.length < 3) {
      toast.error("Category name must be at least 3 characters");
      return;
    }

    if (!categoryDescription) {
      toast.error("Category description is required");
      return;
    }

    try {
      const response = await api.put(`/categories/${editData._id}`, {
        ...editData,
        categoryName,
        categoryDescription,
      });

      const updatedCategory = response.data;

      const updatedList = categories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category,
      );

      setCategories(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);

      toast.success("Category updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    }
  };

  // DELETE
  const confirmDelete = async () => {
    try {
      await api.delete(`/categories/${deleteId}`);

      const updatedList = categories.filter(
        (category) => category._id !== deleteId,
      );

      setCategories(updatedList);
      setFiltered(updatedList);

      setShowDeleteModal(false);

      toast.success("Category deleted successfully!");
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="category-page-wrapper">
      <div className="category-card">
        <div className="category-header">
          <span className="category-badge">CATEGORY MODULE</span>
          <h1>Manage Categories</h1>
        </div>

        <input
          className="category-search"
          placeholder="Search category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        <div className="table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((category) => (
                <tr key={category._id}>
                  <td>{category.categoryId}</td>
                  <td>{category.categoryName}</td>
                  <td>{category.categoryDescription}</td>
                  <td className="actions">
                    <button onClick={() => openUpdateModal(category)}>
                      Update
                    </button>

                    <button
                      className="delete"
                      onClick={() => {
                        setDeleteId(category._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Edit Category</h2>
              <p>Update category details</p>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  placeholder="Enter category name"
                  value={editData.categoryName || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^[A-Za-z\s]*$/.test(value)) {
                      toast.error("Only letters and spaces allowed");
                      return;
                    }

                    setEditData({
                      ...editData,
                      categoryName: value,
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter category description"
                  value={editData.categoryDescription || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      categoryDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowUpdateModal(false)}>Cancel</button>

              <button className="primary" onClick={submitUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Delete Category</h2>
              <p>This action cannot be undone</p>
            </div>

            <div className="modal-delete-text">
              Are you sure you want to delete this category?
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>

              <button className="danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

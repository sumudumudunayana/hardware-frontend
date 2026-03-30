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
    const res = await api.get("/categories");
    setCategories(res.data);
    setFiltered(res.data);
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();
    if (!key.trim()) return setFiltered(categories);

    const result = categories.filter(
      (c) =>
        c.categoryName.toLowerCase().includes(key) ||
        c._id.toString() === key
    );
    setFiltered(result);
  };

  const openUpdateModal = (cat) => {
    setEditData(cat);
    setShowUpdateModal(true);
  };

  //  UPDATE WITH VALIDATION + SONNER
  const submitUpdate = async () => {
    const errors = [];

    if (!editData.categoryName?.trim()) {
      errors.push("Category name is required");
    }

    if (!editData.categoryDescription?.trim()) {
      errors.push("Category description is required");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await toast.promise(
        api.put(`/categories/${editData._id}`, editData),
        {
          loading: "Updating category...",
          success: "Category updated successfully!",
          error: "Update failed!",
        }
      );

      loadCategories();
      setShowUpdateModal(false);

    } catch (err) {}
  };

  //DELETE WITH SONNER
  const confirmDelete = async () => {
    try {
      await toast.promise(
        api.delete(`/categories/${deleteId}`),
        {
          loading: "Deleting category...",
          success: "Category deleted successfully!",
          error: "Delete failed!",
        }
      );

      loadCategories();
      setShowDeleteModal(false);

    } catch (err) {}
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
              {filtered.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.categoryId}</td>
                  <td>{cat.categoryName}</td>
                  <td>{cat.categoryDescription}</td>
                  <td className="actions">
                    <button onClick={() => openUpdateModal(cat)}>
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => {
                        setDeleteId(cat._id);
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
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      categoryName: e.target.value,
                    })
                  }
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
              <button onClick={() => setShowUpdateModal(false)}>
                Cancel
              </button>

              <button className="primary" onClick={submitUpdate}>
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/*  DELETE MODAL */}
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
              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>

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
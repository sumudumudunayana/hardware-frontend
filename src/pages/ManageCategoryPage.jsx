import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageCategoryPageStyles.css";

export default function ManageCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    categoryName: "",
    categoryDescription: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const loadCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/category/get-all");
      setCategories(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) {
      setFiltered(categories);
      return;
    }

    const result = categories.filter(
      (c) =>
        c.categoryName.toLowerCase().includes(key) || c.id.toString() === key
    );

    setFiltered(result);
  };

  const openUpdateModal = (category) => {
    setEditData({ ...category });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/category/update-category",
        editData
      );

      if (![200, 202, 204].includes(res.status)) throw new Error();

      const updated = categories.map((c) =>
        c.id === editData.id ? editData : c
      );

      setCategories(updated);
      setFiltered(updated);

      setAlert({
        show: true,
        type: "success",
        message: "Category updated successfully!",
      });

      setShowUpdateModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update category!",
      });
    }

    setTimeout(() => setAlert({ show: false }), 2500);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/category/delete-by-id/${deleteId}`
      );

      if (![200, 202, 204].includes(res.status)) throw new Error();

      const updated = categories.filter((c) => c.id !== deleteId);
      setCategories(updated);
      setFiltered(updated);

      setAlert({
        show: true,
        type: "success",
        message: "Category deleted successfully!",
      });

      setShowDeleteModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete category!",
      });
    }

    setTimeout(() => setAlert({ show: false }), 2500);
  };

  return (
    <div className="manage-category-bg">
      <div className="manage-category-overlay"></div>

      <div className="manage-category-container">
        <h1 className="manage-category-title">Manage Categories</h1>

        {alert.show && (
          <div className={`alert-box ${alert.type}`}>{alert.message}</div>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID or Category Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>

        <div className="table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.categoryName}</td>
                    <td>{cat.categoryDescription}</td>
                    <td className="action-buttons">
                      <button
                        className="update-btn"
                        onClick={() => openUpdateModal(cat)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(cat.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showUpdateModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Update Category</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                name="categoryName"
                value={editData.categoryName}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                name="categoryDescription"
                value={editData.categoryDescription}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitUpdate}>
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Category</h2>
            <p>Are you sure you want to delete category ID {deleteId}?</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

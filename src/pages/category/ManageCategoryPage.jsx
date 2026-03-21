import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await axios.get("http://localhost:5500/api/categories");
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

  const submitUpdate = async () => {
    await axios.put(
      `http://localhost:5500/api/categories/${editData._id}`,
      editData
    );
    loadCategories();
    setShowUpdateModal(false);
  };

  const confirmDelete = async () => {
    await axios.delete(
      `http://localhost:5500/api/categories/${deleteId}`
    );
    loadCategories();
    setShowDeleteModal(false);
  };

  return (
    <div className="category-page-wrapper">
      <div className="category-card">

        <div className="category-header">
          <span className="category-badge">CATEGORY MODULE</span>
          <h1>Manage Categories</h1>
          <p>Edit or remove category records</p>
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

            <h2>Edit Category</h2>

            <input
              value={editData.categoryName}
              onChange={(e) =>
                setEditData({ ...editData, categoryName: e.target.value })
              }
            />

            <textarea
              value={editData.categoryDescription}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  categoryDescription: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowUpdateModal(false)}>
                Cancel
              </button>
              <button className="primary" onClick={submitUpdate}>
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Category</h2>
            <p>Are you sure?</p>

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
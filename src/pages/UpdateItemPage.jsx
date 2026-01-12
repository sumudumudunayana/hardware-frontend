import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/UpdateItemPageStyles.css";

export default function UpdateItemPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    itemName: "",
    itemCategory: "",
    itemSellingPrice: "",
    itemCostPrice: "",
    itemCompany: "",
    itemDistributor: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const loadDropdownData = async () => {
    try {
      const [catRes, comRes, distRes] = await Promise.all([
        axios.get("http://localhost:8080/category/get-all"),
        axios.get("http://localhost:8080/company/get-all"),
        axios.get("http://localhost:8080/distributor/get-all"),
      ]);
      setCategories(catRes.data);
      setCompanies(comRes.data);
      setDistributors(distRes.data);
    } catch (error) {
      console.error("Failed to load dropdown data", error);
    }
  };

  const loadItems = async () => {
    try {
      const res = await axios.get("http://localhost:8080/item/get-all");
      setItems(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed loading items", err);
    }
  };

  useEffect(() => {
    loadItems();
    loadDropdownData();
  }, []);

  const autoSearch = (text) => {
    const keyword = text.toLowerCase();
    if (keyword.trim() === "") return setFiltered(items);

    const result = items.filter(
      (i) =>
        i.itemName.toLowerCase().includes(keyword) ||
        i.id.toString() === keyword
    );
    setFiltered(result);
  };

  const openUpdateModal = (item) => {
    setEditData({ ...item });
    setShowUpdateModal(true);
  };
  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/item/update-item",
        editData
      );
      if (![200, 202, 204].includes(res.status)) throw new Error();
      const updated = items.map((item) =>
        item.id === editData.id ? editData : item
      );

      setItems(updated);
      setFiltered(updated);

      setAlert({
        show: true,
        type: "success",
        message: "Item updated successfully!",
      });

      setShowUpdateModal(false);
    } catch {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update item!",
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
        `http://localhost:8080/item/delete-by-id/${deleteId}`
      );
      if (![200, 202, 204].includes(res.status)) throw new Error();

      const updated = items.filter((item) => item.id !== deleteId);
      setItems(updated);
      setFiltered(updated);
      setAlert({
        show: true,
        type: "success",
        message: "Item deleted successfully!",
      });
      setShowDeleteModal(false);
    } catch {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete item!",
      });
    }
    setTimeout(() => setAlert({ show: false }), 2500);
  };

  return (
    <div className="update-item-bg">
      <div className="update-item-overlay"></div>
      <div className="update-item-container">
        <h1 className="update-item-title">Update Items</h1>
        {alert.show && <div className={`alert-box ${alert.type}`}>{alert.message}</div>}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>
        <div className="table-wrapper">
          <table className="update-item-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>Cost Price</th>
                <th>Company</th>
                <th>Distributor</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemCategory}</td>
                    <td>{item.itemSellingPrice}</td>
                    <td>{item.itemCostPrice}</td>
                    <td>{item.itemCompany}</td>
                    <td>{item.itemDistributor}</td>
                    <td className="action-buttons">
                      <button className="update-btn" onClick={() => openUpdateModal(item)}>
                        Update
                      </button>
                      <button className="delete-btn" onClick={() => openDeleteModal(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="no-results" colSpan="8">
                    No items found.
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
            <h2>Update Item</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                name="itemName"
                value={editData.itemName}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="itemCategory"
                value={editData.itemCategory}
                onChange={handleUpdateChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Company</label>
              <select
                name="itemCompany"
                value={editData.itemCompany}
                onChange={handleUpdateChange}
              >
                <option value="">Select Company</option>
                {companies.map((com) => (
                  <option key={com.id} value={com.companyName}>
                    {com.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Distributor</label>
              <select
                name="itemDistributor"
                value={editData.itemDistributor}
                onChange={handleUpdateChange}
              >
                <option value="">Select Distributor</option>
                {distributors.map((dist) => (
                  <option key={dist.id} value={dist.distributorName}>
                    {dist.distributorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Selling Price</label>
              <input
                type="number"
                name="itemSellingPrice"
                value={editData.itemSellingPrice}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Cost Price</label>
              <input
                type="number"
                name="itemCostPrice"
                value={editData.itemCostPrice}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitUpdate}>
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Item</h2>
            <p>Are you sure you want to delete item ID {deleteId}?</p>

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

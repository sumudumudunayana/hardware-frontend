import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManagePromotionPageStyles.css";

export default function ManagePromotionPage() {
  const [promotions, setPromotions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadPromotions = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/promotions");
      setPromotions(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed loading promotions", err);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const autoSearch = (text) => {
    const keyword = text.toLowerCase();
    if (!keyword.trim()) return setFiltered(promotions);

    const result = promotions.filter(
      (p) =>
        p.promotionName.toLowerCase().includes(keyword) ||
        p.promotionId?.toString() === keyword
    );

    setFiltered(result);
  };

  const openUpdateModal = (promo) => {
    setEditData({
      ...promo,
      startDate: promo.startDate?.substring(0, 10),
      endDate: promo.endDate?.substring(0, 10)
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5500/api/promotions/${editData._id}`,
        editData
      );

      setAlert("Promotion updated successfully!");
      setShowUpdateModal(false);
      loadPromotions();
    } catch {
      setAlert("Failed to update promotion!");
    }

    setTimeout(() => setAlert(null), 2500);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5500/api/promotions/${deleteId}`
      );

      setAlert("Promotion deleted successfully!");
      setShowDeleteModal(false);
      loadPromotions();
    } catch {
      setAlert("Failed to delete promotion!");
    }

    setTimeout(() => setAlert(null), 2500);
  };

  return (
    <div className="mp-bg">
      <div className="mp-overlay"></div>

      <div className="mp-container">
        <h1 className="mp-title">Manage Promotions</h1>

        {alert && <div className="alert-box">{alert}</div>}

        <div className="mp-search-box">
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

        <div className="mp-table-wrapper">
          <table className="mp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((promo) => (
                <tr key={promo._id}>
                  <td>{promo.promotionId}</td>
                  <td>{promo.promotionName}</td>
                  <td>
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `Rs. ${promo.discountValue}`}
                  </td>
                  <td>{new Date(promo.startDate).toLocaleDateString()}</td>
                  <td>{new Date(promo.endDate).toLocaleDateString()}</td>
                  <td>{promo.status}</td>
                  <td className="mp-actions">
                    <button
                      className="update-btn"
                      onClick={() => openUpdateModal(promo)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(promo._id)}
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

      {showUpdateModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Update Promotion</h2>

            <input
              name="promotionName"
              value={editData.promotionName}
              onChange={handleUpdateChange}
            />

            <input
              type="number"
              name="discountValue"
              value={editData.discountValue}
              onChange={handleUpdateChange}
            />

            <input
              type="date"
              name="startDate"
              value={editData.startDate}
              onChange={handleUpdateChange}
            />

            <input
              type="date"
              name="endDate"
              value={editData.endDate}
              onChange={handleUpdateChange}
            />

            <select
              name="status"
              value={editData.status}
              onChange={handleUpdateChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Promotion</h2>
            <p>Are you sure you want to delete this promotion?</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
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
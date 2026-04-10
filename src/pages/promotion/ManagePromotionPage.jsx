import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/promotion/ManagePromotionPageStyles.css";

export default function ManagePromotionPage() {
  const [promotions, setPromotions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const isExpired = (endDate) => {
    if (!endDate) return false;

    const end = new Date(endDate);
    const now = new Date();

    return end < now;
  };

  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load promotions");
    }
  };

  useEffect(() => {
    loadPromotions();

    const interval = setInterval(() => {
      loadPromotions();
    }, 60000); // refresh every 1 minute

    return () => clearInterval(interval);
  }, []);

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) {
      setFiltered(promotions);
      return;
    }

    setFiltered(
      promotions.filter(
        (promo) =>
          promo.promotionName.toLowerCase().includes(key) ||
          promo.promotionId?.toString() === key,
      ),
    );
  };

  const openUpdateModal = (promo) => {
    setEditData({
      ...promo,
      startDate: promo.startDate?.substring(0, 10),
      endDate: promo.endDate?.substring(0, 10),
    });

    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const submitUpdate = async () => {
    const {
      promotionName,
      discountValue,
      discountType,
      startDate,
      endDate,
      status,
    } = editData;

    const discount = Number(discountValue);

    if (!promotionName?.trim()) {
      toast.error("Promotion name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(promotionName.trim())) {
      toast.error("Promotion name can contain only letters and spaces");
      return;
    }

    if (promotionName.trim().length < 3) {
      toast.error("Promotion name must be at least 3 characters");
      return;
    }

    if (discountValue === "") {
      toast.error("Discount value is required");
      return;
    }

    if (discount < 0) {
      toast.error("Discount cannot be negative");
      return;
    }

    if (discountType === "percentage" && discount > 100) {
      toast.error("Percentage cannot exceed 100%");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select dates");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const response = await api.put(`/promotions/${editData._id}`, {
        ...editData,
        promotionName: promotionName.trim(),
        discountValue: discount,
        status,
      });

      const updatedPromotion = response.data;

      const updatedList = promotions.map((promo) =>
        promo._id === updatedPromotion._id ? updatedPromotion : promo,
      );

      setPromotions(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);

      toast.success("Promotion updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/promotions/${deleteId}`);

      const updatedList = promotions.filter((promo) => promo._id !== deleteId);

      setPromotions(updatedList);
      setFiltered(updatedList);

      setShowDeleteModal(false);

      toast.success("Promotion deleted successfully!");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="prmm-wrapper">
      <div className="prmm-card">
        <div className="prmm-header">
          <span className="prmm-badge">PROMOTION</span>
          <h1>Manage Promotions</h1>
        </div>

        <input
          className="prmm-search"
          placeholder="Search by ID or promotion name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        <div className="prmm-table-wrapper">
          <table className="prmm-table">
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
              {filtered.map((promo) => {
                const expired = isExpired(promo.endDate);

                return (
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

                    <td>
                      <span
                        className={`prmm-status ${
                          expired ? "inactive" : promo.status
                        }`}
                      >
                        {expired ? "expired" : promo.status}
                      </span>
                    </td>

                    <td className="prmm-actions">
                      <button
                        className="prmm-update"
                        onClick={() => openUpdateModal(promo)}
                      >
                        Update
                      </button>

                      <button
                        className="prmm-delete"
                        onClick={() => {
                          setDeleteId(promo._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="prmm-modal-bg">
          <div className="prmm-modal-box">
            <h2>Update Promotion</h2>

            <label>Promotion Name</label>
            <input
              placeholder="Enter promotion name"
              value={editData.promotionName || ""}
              onChange={(e) => {
                const value = e.target.value;

                if (!/^[A-Za-z\s]*$/.test(value)) {
                  toast.error("Only letters and spaces allowed");
                  return;
                }

                setEditData({
                  ...editData,
                  promotionName: value,
                });
              }}
            />

            <label>Discount Value</label>
            <input
              type="number"
              min="0"
              placeholder="Enter discount"
              value={editData.discountValue || ""}
              onChange={(e) => {
                const value = e.target.value;

                if (Number(value) < 0) return;

                setEditData({
                  ...editData,
                  discountValue: value,
                });
              }}
            />

            <label>Start Date</label>
            <input
              type="date"
              value={editData.startDate || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  startDate: e.target.value,
                })
              }
            />

            <label>End Date</label>
            <input
              type="date"
              value={editData.endDate || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  endDate: e.target.value,
                })
              }
            />

            <label>Status</label>
            <select
              value={editData.status || "active"}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  status: e.target.value,
                })
              }
            >
              <option value="active" disabled={isExpired(editData.endDate)}>
                Active
              </option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="prmm-modal-actions">
              <button onClick={closeUpdateModal} className="prmm-btn-cancel">
                Cancel
              </button>

              <button onClick={submitUpdate} className="prmm-btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="prmm-modal-bg">
          <div className="prmm-modal-box">
            <h2>Delete Promotion</h2>

            <p>Are you sure?</p>

            <div className="prmm-modal-actions">
              <button
                className="prmm-btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button className="prmm-btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

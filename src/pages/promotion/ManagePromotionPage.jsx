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
  }, []);

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) return setFiltered(promotions);

    setFiltered(
      promotions.filter(
        (p) =>
          p.promotionName.toLowerCase().includes(key) ||
          p.promotionId?.toString() === key,
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

  //  UPDATE WITH VALIDATION
  const submitUpdate = async () => {
    const { promotionName, discountValue, discountType, startDate, endDate } =
      editData;

    const discount = Number(discountValue);

    // Validation
    if (!promotionName?.trim()) {
      toast.error("Promotion name is required");
      return;
    }

    if (promotionName.length < 3) {
      toast.warning("Name too short");
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
      await toast.promise(
        api.put(`/promotions/${editData._id}`, {
          ...editData,
          discountValue: discount,
        }),
        {
          loading: "Updating promotion...",
          success: "Promotion updated successfully!",
          error: "Update failed",
        },
      );

      // ✅ Instant UI update
      const updatedList = promotions.map((p) =>
        p._id === editData._id ? { ...editData } : p,
      );

      setPromotions(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);
    } catch {}
  };

  //  DELETE WITH TOAST
  const confirmDelete = async () => {
    try {
      await toast.promise(
        api.delete(`/promotions/${deleteId}`),
        {
          loading: "Deleting promotion...",
          success: "Promotion deleted successfully!",
          error: "Delete failed",
        },
      );

      const updatedList = promotions.filter((p) => p._id !== deleteId);

      setPromotions(updatedList);
      setFiltered(updatedList);

      setShowDeleteModal(false);
    } catch {}
  };

  return (
    <div className="prmm-wrapper">
      <div className="prmm-card">
        {/* HEADER */}
        <div className="prmm-header">
          <span className="prmm-badge">PROMOTION</span>
          <h1>Manage Promotions</h1>
        </div>

        {/* SEARCH */}
        <input
          className="prmm-search"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        {/* TABLE */}
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

                  <td>
                    <span className={`prmm-status ${promo.status}`}>
                      {promo.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="prmm-modal-bg">
          <div className="prmm-modal-box">
            <h2>Update Promotion</h2>

            <input
              value={editData.promotionName}
              onChange={(e) =>
                setEditData({ ...editData, promotionName: e.target.value })
              }
            />

            <input
              type="number"
              min="0"
              value={editData.discountValue}
              onChange={(e) => {
                if (Number(e.target.value) < 0) return;
                setEditData({ ...editData, discountValue: e.target.value });
              }}
            />

            <input
              type="date"
              value={editData.startDate}
              onChange={(e) =>
                setEditData({ ...editData, startDate: e.target.value })
              }
            />

            <input
              type="date"
              value={editData.endDate}
              onChange={(e) =>
                setEditData({ ...editData, endDate: e.target.value })
              }
            />

            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
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

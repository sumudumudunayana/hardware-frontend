import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../../css/company/ManageCompanyPageStyles.css";

export default function ManageCompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({
    _id: "",
    companyName: "",
    companyAddress: "",
    companyContactNumber: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  const loadCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/companies");
      setCompanies(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load companies");
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const autoSearch = (text) => {
    const key = text.toLowerCase();
    if (!key.trim()) return setFiltered(companies);

    setFiltered(
      companies.filter(
        (c) =>
          c.companyName.toLowerCase().includes(key) ||
          c.companyId.toString() === key
      )
    );
  };

  const closeUpdateModal = () => setShowUpdateModal(false);
  const closeDeleteModal = () => setShowDeleteModal(false);

  // ✅ UPDATE WITH VALIDATION
  const submitUpdate = async () => {
  const { companyName, companyAddress, companyContactNumber } = editData;

  // Validation
  if (!companyName?.trim()) {
    toast.error("Company name is required");
    return;
  }

  if (companyName.length < 3) {
    toast.warning("Name too short");
    return;
  }

  if (!companyAddress?.trim()) {
    toast.error("Address is required");
    return;
  }

  if (!/^\d{10}$/.test(companyContactNumber)) {
    toast.error("Invalid contact number");
    return;
  }

  try {
    await toast.promise(
      axios.put(
        `http://localhost:5500/api/companies/${editData._id}`,
        {
          ...editData,
          companyContactNumber: Number(companyContactNumber),
        }
      ),
      {
        loading: "Updating company...",
        success: "Company updated successfully!",
        error: "Update failed!",
      }
    );

    // ✅ 🔥 IMPORTANT: Update state manually
    const updatedList = companies.map((c) =>
      c._id === editData._id ? { ...editData } : c
    );

    setCompanies(updatedList);
    setFiltered(updatedList);

    setShowUpdateModal(false);

  } catch (err) {}
};

  // ✅ DELETE WITH TOAST
  const confirmDelete = async () => {
  try {
    await toast.promise(
      axios.delete(`http://localhost:5500/api/companies/${deleteId}`),
      {
        loading: "Deleting company...",
        success: "Company deleted successfully!",
        error: "Delete failed!",
      }
    );

    // ✅ Remove from state immediately
    const updatedList = companies.filter((c) => c._id !== deleteId);

    setCompanies(updatedList);
    setFiltered(updatedList);

    setShowDeleteModal(false);

  } catch (err) {}
};

  return (
    <div className="cmp-wrapper">
      <div className="cmp-card">

        {/* HEADER */}
        <div className="cmp-header">
          <span className="cmp-badge">COMPANY</span>
          <h1>Manage Companies</h1>

          <input
            className="cmp-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>

        {/* TABLE */}
        <table className="cmp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td>{c.companyId}</td>
                <td>{c.companyName}</td>
                <td>{c.companyAddress}</td>
                <td>{c.companyContactNumber}</td>

                <td className="cmp-actions">
                  <button
                    className="cmp-update"
                    onClick={() => {
                      setEditData(c);
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </button>

                  <button
                    className="cmp-delete"
                    onClick={() => {
                      setDeleteId(c._id);
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

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="cmp-modal-bg">
          <div className="cmp-modal-box">

            <h2>Update Company</h2>

            <input
              value={editData.companyName}
              onChange={(e) =>
                setEditData({ ...editData, companyName: e.target.value })
              }
              placeholder="Company Name"
            />

            <input
              value={editData.companyAddress}
              onChange={(e) =>
                setEditData({ ...editData, companyAddress: e.target.value })
              }
              placeholder="Address"
            />

            <input
              maxLength={10}
              value={editData.companyContactNumber}
              onChange={(e) => {
                if (!/^\d*$/.test(e.target.value)) return;
                setEditData({
                  ...editData,
                  companyContactNumber: e.target.value,
                });
              }}
              placeholder="Contact Number"
            />

            <div className="cmp-modal-actions">
              <button className="cmp-btn-cancel" onClick={closeUpdateModal}>
                Cancel
              </button>

              <button className="cmp-btn-primary" onClick={submitUpdate}>
                Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="cmp-modal-bg">
          <div className="cmp-modal-box">

            <h2>Delete Company</h2>
            <p>Are you sure you want to delete this company?</p>

            <div className="cmp-modal-actions">
              <button className="cmp-btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>

              <button className="cmp-btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
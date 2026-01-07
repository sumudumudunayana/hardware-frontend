import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageDistributorPageStyles.css";

export default function ManageDistributorPage() {
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    distributorName: "",
    distributorDescription: "",
    distributorContactNumber: "",
    distributorEmail: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const loadDistributors = async () => {
    try {
      const res = await axios.get("http://localhost:8080/distributor/get-all");
      setDistributors(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed loading distributors", err);
    }
  };

  useEffect(() => {
    loadDistributors();
  }, []);

  const autoSearch = (text) => {
    const keyword = text.toLowerCase();
    if (keyword.trim() === "") {
      setFiltered(distributors);
      return;
    }

    const result = distributors.filter(
      (d) =>
        d.distributorName.toLowerCase().includes(keyword) ||
        d.id.toString() === keyword
    );
    setFiltered(result);
  };

  const openUpdateModal = (d) => {
    setEditData({ ...d });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/distributor/update-distributor",
        editData
      );
      if (![200, 202, 204].includes(res.status)) throw new Error();
      const updated = distributors.map((d) =>
        d.id === editData.id ? editData : d
      );
      setDistributors(updated);
      setFiltered(updated);
      setAlert({
        show: true,
        type: "success",
        message: "Distributor updated successfully!",
      });
      setShowUpdateModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update distributor!",
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
        `http://localhost:8080/distributor/delete-by-id/${deleteId}`
      );
      if (![200, 202, 204].includes(res.status)) throw new Error();
      const updated = distributors.filter((d) => d.id !== deleteId);
      setDistributors(updated);
      setFiltered(updated);
      setAlert({
        show: true,
        type: "success",
        message: "Distributor deleted successfully!",
      });
      setShowDeleteModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete distributor!",
      });
    }
    setTimeout(() => setAlert({ show: false }), 2500);
  };

  return (
    <div className="md-bg">
      <div className="md-overlay"></div>
      <div className="md-container">
        <h1 className="md-title">Manage Distributors</h1>
        {alert.show && (
          <div className={`alert-box ${alert.type}`}>{alert.message}</div>
        )}
        <div className="md-search-box">
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

        <div className="md-table-wrapper">
          <table className="md-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Distributor</th>
                <th>Description</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.distributorName}</td>
                    <td>{d.distributorDescription}</td>
                    <td>{d.distributorContactNumber}</td>
                    <td>{d.distributorEmail}</td>

                    <td className="md-actions">
                      <button
                        className="update-btn"
                        onClick={() => openUpdateModal(d)}
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(d.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No distributors found.
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
            <h2>Update Distributor</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                name="distributorName"
                value={editData.distributorName}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="distributorDescription"
                value={editData.distributorDescription}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="number"
                name="distributorContactNumber"
                value={editData.distributorContactNumber}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="distributorEmail"
                value={editData.distributorEmail}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitUpdate}>
                Update Distributor
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Distributor</h2>
            <p>Are you sure you want to delete distributor ID {deleteId}?</p>

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

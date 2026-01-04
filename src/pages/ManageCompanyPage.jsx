import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageCompanyPageStyles.css";

export default function ManageCompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    companyName: "",
    companyDescription: "",
    companyAddress: "",
    companyContactNumber: "",
    companyEmail: "",
  });

  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const loadCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:8080/company/get-all");
      setCompanies(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed loading companies", err);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const autoSearch = (text) => {
    const keyword = text.toLowerCase();
    if (keyword.trim() === "") {
      setFiltered(companies);
      return;
    }

    const result = companies.filter(
      (c) =>
        c.companyName.toLowerCase().includes(keyword) ||
        c.id.toString() === keyword
    );
    setFiltered(result);
  };

  const openUpdateModal = (company) => {
    setEditData({ ...company });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/company/update-company",
        editData
      );
      if (![200, 202, 204].includes(res.status)) throw new Error();
      const updated = companies.map((c) =>
        c.id === editData.id ? editData : c
      );
      setCompanies(updated);
      setFiltered(updated);
      setAlert({
        show: true,
        type: "success",
        message: "Company updated successfully!",
      });

      setShowUpdateModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update company.",
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
        `http://localhost:8080/company/delete-by-id/${deleteId}`
      );

      if (![200, 202, 204].includes(res.status)) throw new Error();

      const updated = companies.filter((c) => c.id !== deleteId);

      setCompanies(updated);
      setFiltered(updated);

      setAlert({
        show: true,
        type: "success",
        message: "Company deleted successfully!",
      });

      setShowDeleteModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete company.",
      });
    }
    setTimeout(() => setAlert({ show: false }), 2500);
  };

  return (
    <div className="manage-company-bg">
      <div className="manage-company-overlay"></div>
      <div className="manage-company-container">
        <h1 className="manage-company-title">Manage Companies</h1>
        {alert.show && (
          <div className={`alert-box ${alert.type}`}>{alert.message}</div>
        )}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>
        <div className="table-wrapper">
          <table className="company-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Description</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((company) => (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td>{company.companyName}</td>
                    <td>{company.companyDescription}</td>
                    <td>{company.companyAddress}</td>
                    <td>{company.companyContactNumber}</td>
                    <td>{company.companyEmail}</td>
                    <td className="action-buttons">
                      <button
                        className="update-btn"
                        onClick={() => openUpdateModal(company)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(company.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="no-results" colSpan="7">
                    No companies found.
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
            <h2>Update Company</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                name="companyName"
                value={editData.companyName}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                name="companyDescription"
                value={editData.companyDescription}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                name="companyAddress"
                value={editData.companyAddress}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="number"
                name="companyContactNumber"
                value={editData.companyContactNumber}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="companyEmail"
                value={editData.companyEmail}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitUpdate}>
                Update Company
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Company</h2>
            <p>Are you sure you want to delete company ID {deleteId}?</p>

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

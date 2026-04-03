import React, { useEffect, useState } from "react";
import api from "../../services/api";
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
    companyDescription: "",
    companyAddress: "",
    companyContactNumber: "",
    companyEmail: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  const loadCompanies = async () => {
    try {
      const res = await api.get("/companies");
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

    if (!key.trim()) {
      setFiltered(companies);
      return;
    }

    setFiltered(
      companies.filter(
        (company) =>
          company.companyName.toLowerCase().includes(key) ||
          company.companyId?.toString() === key,
      ),
    );
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const closeDeleteModal = () => setShowDeleteModal(false);

  // UPDATE
  const submitUpdate = async () => {
    const {
      companyName,
      companyDescription,
      companyAddress,
      companyContactNumber,
      companyEmail,
    } = editData;

    // validations
    if (!companyName?.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(companyName.trim())) {
      toast.error("Company name can contain only letters and spaces");
      return;
    }

    if (companyName.trim().length < 3) {
      toast.error("Company name must be at least 3 characters");
      return;
    }

    if (!companyDescription?.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!companyAddress?.trim()) {
      toast.error("Address is required");
      return;
    }

    if (!/^[A-Za-z0-9\s,./-]+$/.test(companyAddress.trim())) {
      toast.error("Address contains invalid symbols");
      return;
    }

    if (!/^\d{10}$/.test(companyContactNumber)) {
      toast.error("Contact number must be exactly 10 digits");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(companyEmail)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      const response = await api.put(`/companies/${editData._id}`, {
        ...editData,
        companyName: companyName.trim(),
        companyDescription: companyDescription.trim(),
        companyAddress: companyAddress.trim(),
        companyContactNumber,
        companyEmail: companyEmail.trim().toLowerCase(),
      });

      const updatedCompany = response.data;

      const updatedList = companies.map((company) =>
        company._id === updatedCompany._id ? updatedCompany : company,
      );

      setCompanies(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);

      toast.success("Company updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    }
  };

  // DELETE
  const confirmDelete = async () => {
    try {
      await api.delete(`/companies/${deleteId}`);

      const updatedList = companies.filter(
        (company) => company._id !== deleteId,
      );

      setCompanies(updatedList);
      setFiltered(updatedList);

      setShowDeleteModal(false);

      toast.success("Company deleted successfully!");
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="cmp-wrapper">
      <div className="cmp-card">
        <div className="cmp-header">
          <span className="cmp-badge">COMPANY</span>
          <h1>Manage Companies</h1>

          <input
            className="cmp-search"
            placeholder="Search by ID or company name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              autoSearch(e.target.value);
            }}
          />
        </div>

        <table className="cmp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((company) => (
              <tr key={company._id}>
                <td>{company.companyId}</td>
                <td>{company.companyName}</td>
                <td>{company.companyAddress}</td>
                <td>{company.companyContactNumber}</td>
                <td>{company.companyEmail}</td>

                <td className="cmp-actions">
                  <button
                    className="cmp-update"
                    onClick={() => {
                      setEditData(company);
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </button>

                  <button
                    className="cmp-delete"
                    onClick={() => {
                      setDeleteId(company._id);
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

            <div className="cmp-form-group">
              <label>Company Name</label>
              <input
                placeholder="Enter company name"
                value={editData.companyName || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!/^[A-Za-z\s]*$/.test(value)) {
                    toast.error("Only letters and spaces allowed");
                    return;
                  }

                  setEditData({
                    ...editData,
                    companyName: value,
                  });
                }}
              />
            </div>

            <div className="cmp-form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter company description"
                value={editData.companyDescription || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    companyDescription: e.target.value,
                  })
                }
              />
            </div>

            <div className="cmp-form-group">
              <label>Address</label>
              <input
                placeholder="Enter company address"
                value={editData.companyAddress || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    companyAddress: e.target.value,
                  })
                }
              />
            </div>

            <div className="cmp-form-group">
              <label>Contact Number</label>
              <input
                placeholder="Enter contact number"
                maxLength={10}
                value={editData.companyContactNumber || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!/^\d*$/.test(value)) {
                    toast.error("Only numbers allowed");
                    return;
                  }

                  setEditData({
                    ...editData,
                    companyContactNumber: value,
                  });
                }}
              />
            </div>

            <div className="cmp-form-group">
              <label>Email</label>
              <input
                placeholder="Enter company email"
                value={editData.companyEmail || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    companyEmail: e.target.value,
                  })
                }
              />
            </div>

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

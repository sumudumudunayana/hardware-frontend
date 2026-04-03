import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/distributor/ManageDistributorPageStyles.css";

export default function ManageDistributorPage() {
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadDistributors();
  }, []);

  const loadDistributors = async () => {
    try {
      const res = await api.get("/distributors");

      setDistributors(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load suppliers");
    }
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) {
      setFiltered(distributors);
      return;
    }

    setFiltered(
      distributors.filter(
        (d) =>
          d.distributorName.toLowerCase().includes(key) ||
          d.distributorId?.toString() === key,
      ),
    );
  };

  // UPDATE
  const submitUpdate = async () => {
    const {
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    } = editData;

    // validation
    if (!distributorName?.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(distributorName.trim())) {
      toast.error("Supplier name can contain only letters and spaces");
      return;
    }

    if (distributorName.trim().length < 2) {
      toast.error("Supplier name must be at least 2 characters");
      return;
    }

    if (!distributorDescription?.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!distributorContactNumber) {
      toast.error("Contact number is required");
      return;
    }

    if (!/^\d{10}$/.test(distributorContactNumber)) {
      toast.error("Contact number must be exactly 10 digits");
      return;
    }

    if (!distributorEmail?.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(distributorEmail)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      const response = await api.put(`/distributors/${editData._id}`, {
        ...editData,
        distributorName: distributorName.trim(),
        distributorDescription: distributorDescription.trim(),
        distributorContactNumber: distributorContactNumber,
        distributorEmail: distributorEmail.trim().toLowerCase(),
      });

      const updatedDistributor = response.data;

      const updatedList = distributors.map((distributor) =>
        distributor._id === updatedDistributor._id
          ? updatedDistributor
          : distributor,
      );

      setDistributors(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);

      toast.success("Supplier updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    }
  };

  // DELETE
  const confirmDelete = async () => {
    try {
      await api.delete(`/distributors/${deleteId}`);

      const updated = distributors.filter((d) => d._id !== deleteId);

      setDistributors(updated);
      setFiltered(updated);

      setShowDeleteModal(false);

      toast.success("Supplier deleted successfully!");
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="distributor-page-wrapper">
      <div className="distributor-card">
        <div className="header">
          <span className="badge">SUPPLIERS</span>
          <h1>Manage Suppliers</h1>
        </div>

        <input
          className="search"
          placeholder="Search by ID or Name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Description</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d) => (
                <tr key={d._id}>
                  <td>{d.distributorId}</td>
                  <td>{d.distributorName}</td>
                  <td>{d.distributorDescription}</td>
                  <td>{d.distributorContactNumber}</td>
                  <td>{d.distributorEmail}</td>

                  <td className="actions">
                    <button
                      onClick={() => {
                        setEditData(d);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="delete"
                      onClick={() => {
                        setDeleteId(d._id);
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
          <div className="modal-box light">
            <div className="modal-header">
              <h2>Update Supplier</h2>
              <p>Edit supplier details</p>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  value={editData.distributorName || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^[A-Za-z\s]*$/.test(value)) {
                      toast.error("Only letters and spaces allowed");
                      return;
                    }

                    setEditData({
                      ...editData,
                      distributorName: value,
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editData.distributorDescription || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      distributorDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  maxLength={10}
                  value={editData.distributorContactNumber || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^\d*$/.test(value)) {
                      toast.error("Only numbers allowed");
                      return;
                    }

                    setEditData({
                      ...editData,
                      distributorContactNumber: value,
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  value={editData.distributorEmail || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      distributorEmail: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowUpdateModal(false)}>Cancel</button>

              <button className="primary" onClick={submitUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box light">
            <h2>Delete Supplier</h2>
            <p>Are you sure?</p>

            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>

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

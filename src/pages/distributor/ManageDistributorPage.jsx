import React, { useEffect, useState } from "react";
import axios from "axios";
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
      const res = await axios.get("http://localhost:5500/api/distributors");
      setDistributors(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to load suppliers");
    }
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();
    if (!key.trim()) return setFiltered(distributors);

    setFiltered(
      distributors.filter(
        (d) =>
          d.distributorName.toLowerCase().includes(key) ||
          d.distributorId?.toString() === key
      )
    );
  };

  // ✅ VALIDATION + UPDATE
  const submitUpdate = async () => {
    const {
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    } = editData;

    // Name validation
    if (!distributorName?.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    if (distributorName.length < 3) {
      toast.warning("Name too short", {
        description: "Must be at least 3 characters",
      });
      return;
    }

    // Description validation
    if (!distributorDescription?.trim()) {
      toast.error("Description is required");
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(distributorContactNumber)) {
      toast.error("Invalid contact number", {
        description: "Must be exactly 10 digits",
      });
      return;
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(distributorEmail)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      await toast.promise(
        axios.put(
          `http://localhost:5500/api/distributors/${editData._id}`,
          {
            ...editData,
            distributorContactNumber: Number(distributorContactNumber),
          }
        ),
        {
          loading: "Updating supplier...",
          success: "Supplier updated successfully!",
          error: "Update failed!",
        }
      );

      setShowUpdateModal(false);
      loadDistributors();

    } catch (err) {}
  };

  // ✅ DELETE WITH TOAST
  const confirmDelete = async () => {
    try {
      await toast.promise(
        axios.delete(`http://localhost:5500/api/distributors/${deleteId}`),
        {
          loading: "Deleting supplier...",
          success: "Supplier deleted successfully!",
          error: "Delete failed!",
        }
      );

      setShowDeleteModal(false);
      loadDistributors();

    } catch (err) {}
  };

  return (
    <div className="distributor-page-wrapper">
      <div className="distributor-card">

        <div className="header">
          <span className="badge">SUPPLIERS</span>
          <h1>Manage Suppliers</h1>
          <p>View, update and delete supplier records</p>
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

            <h2>Update Supplier</h2>

            <input
              name="distributorName"
              value={editData.distributorName}
              onChange={(e) =>
                setEditData({ ...editData, distributorName: e.target.value })
              }
            />

            <textarea
              name="distributorDescription"
              value={editData.distributorDescription}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  distributorDescription: e.target.value,
                })
              }
            />

            <input
              name="distributorContactNumber"
              maxLength={10}
              value={editData.distributorContactNumber}
              onChange={(e) => {
                if (!/^\d*$/.test(e.target.value)) return;
                setEditData({
                  ...editData,
                  distributorContactNumber: e.target.value,
                });
              }}
            />

            <input
              name="distributorEmail"
              value={editData.distributorEmail}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  distributorEmail: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowUpdateModal(false)}>
                Cancel
              </button>

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
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageCustomerPageStyles.css";

export default function ManageCustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    customerName: "",
    customerContactNumber: "",
    customerEmail: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const loadCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/customer/get-all");
      setCustomers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed loading customers", err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const autoSearch = (text) => {
    const keyword = text.toLowerCase();
    if (keyword.trim() === "") {
      setFiltered(customers);
      return;
    }
    const result = customers.filter(
      (c) =>
        c.customerName.toLowerCase().includes(keyword) ||
        c.id.toString() === keyword
    );
    setFiltered(result);
  };

  const openUpdateModal = (c) => {
    setEditData({ ...c });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/customer/update-customer",
        editData
      );
      if (![200, 202, 204].includes(res.status)) throw new Error();
      const updated = customers.map((c) =>
        c.id === editData.id ? editData : c
      );
      setCustomers(updated);
      setFiltered(updated);

      setAlert({
        show: true,
        type: "success",
        message: "Customer updated successfully!",
      });

      setShowUpdateModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update customer!",
      });
    }

    setTimeout(() => setAlert({ show: false }), 2500);
  };

  // Delete
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/customer/delete-by-id/${deleteId}`
      );

      if (![200, 202, 204].includes(res.status)) throw new Error();

      const updated = customers.filter((c) => c.id !== deleteId);
      setCustomers(updated);
      setFiltered(updated);

      setAlert({
        show: true,
        type: "success",
        message: "Customer deleted successfully!",
      });

      setShowDeleteModal(false);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete customer!",
      });
    }

    setTimeout(() => setAlert({ show: false }), 2500);
  };

  return (
    <div className="mc-bg">
      <div className="mc-overlay"></div>

      <div className="mc-container">
        <h1 className="mc-title">Manage Customers</h1>

        {alert.show && (
          <div className={`alert-box ${alert.type}`}>{alert.message}</div>
        )}

        <div className="mc-search-box">
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

        <div className="mc-table-wrapper">
          <table className="mc-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.customerName}</td>
                    <td>{c.customerContactNumber}</td>
                    <td>{c.customerEmail}</td>
                    <td className="mc-actions">
                      <button
                        className="update-btn"
                        onClick={() => openUpdateModal(c)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Update Customer</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                name="customerName"
                value={editData.customerName}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="number"
                name="customerContactNumber"
                value={editData.customerContactNumber}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="customerEmail"
                value={editData.customerEmail}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitUpdate}>
                Update Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Delete Customer</h2>
            <p>Are you sure you want to delete customer ID {deleteId}?</p>

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

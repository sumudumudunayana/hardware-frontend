import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../../css/customer/ManageCustomerPageStyles.css";

export default function ManageCustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({
    _id: "",
    customerName: "",
    customerContactNumber: "",
    customerEmail: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/customers");
      setCustomers(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to load customers");
    }
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();
    if (!key.trim()) return setFiltered(customers);

    setFiltered(
      customers.filter(
        (c) =>
          c.customerName.toLowerCase().includes(key) ||
          c.customerId.toString() === key
      )
    );
  };

  const openUpdateModal = (c) => {
    setEditData(c);
    setShowUpdateModal(true);
  };

  // VALIDATION + UPDATE
  const submitUpdate = async () => {
    const { customerName, customerContactNumber, customerEmail } = editData;

    // Name validation
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (customerName.length < 3) {
      toast.warning("Name too short", {
        description: "Must be at least 3 characters",
      });
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(customerContactNumber)) {
      toast.error("Invalid contact number", {
        description: "Must be exactly 10 digits",
      });
      return;
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      await toast.promise(
        axios.put(
          `http://localhost:5500/api/customers/${editData._id}`,
          editData
        ),
        {
          loading: "Updating customer...",
          success: "Customer updated successfully!",
          error: "Update failed!",
        }
      );

      const updated = customers.map((c) =>
        c._id === editData._id ? editData : c
      );

      setCustomers(updated);
      setFiltered(updated);
      setShowUpdateModal(false);

    } catch (err) {}
  };

  // ✅ DELETE WITH TOAST
  const confirmDelete = async () => {
    try {
      await toast.promise(
        axios.delete(`http://localhost:5500/api/customers/${deleteId}`),
        {
          loading: "Deleting customer...",
          success: "Customer deleted successfully!",
          error: "Delete failed!",
        }
      );

      const updated = customers.filter((c) => c._id !== deleteId);
      setCustomers(updated);
      setFiltered(updated);
      setShowDeleteModal(false);

    } catch (err) {}
  };

  return (
    <div className="customer-page-wrapper">

      <div className="customer-card">

        <div className="customer-header">
          <span className="customer-badge">CUSTOMERS</span>
          <h1>Manage Customers</h1>
          <p>View, update and manage customer records</p>
        </div>

        <input
          className="customer-search"
          placeholder="Search by ID or Name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c._id}>
                    <td>{c.customerId}</td>
                    <td>{c.customerName}</td>
                    <td>{c.customerContactNumber}</td>
                    <td>{c.customerEmail}</td>

                    <td className="actions">
                      <button onClick={() => openUpdateModal(c)}>
                        Update
                      </button>

                      <button
                        className="delete"
                        onClick={() => {
                          setDeleteId(c._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No customers found
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

            <input
              name="customerName"
              value={editData.customerName}
              onChange={(e) =>
                setEditData({ ...editData, customerName: e.target.value })
              }
            />

            <input
              name="customerContactNumber"
              maxLength={10}
              value={editData.customerContactNumber}
              onChange={(e) => {
                if (!/^\d*$/.test(e.target.value)) return;
                setEditData({
                  ...editData,
                  customerContactNumber: e.target.value,
                });
              }}
            />

            <input
              name="customerEmail"
              value={editData.customerEmail}
              onChange={(e) =>
                setEditData({ ...editData, customerEmail: e.target.value })
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
          <div className="modal-box">

            <h2>Delete Customer</h2>
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
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

  // ✅ MULTIPLE VALIDATION (SAFE FOR "0")
  const submitUpdate = async () => {
    const { customerName, customerContactNumber, customerEmail } = editData;

    const errors = [];

    if (!customerName?.trim()) {
      errors.push("Customer name is required");
    } else if (customerName.trim().length < 3) {
      errors.push("Name must be at least 3 characters");
    }

    if (!customerContactNumber?.toString().trim()) {
      errors.push("Contact number is required");
    } else if (!/^\d{10}$/.test(customerContactNumber)) {
      errors.push("Contact number must be exactly 10 digits");
    }

    if (!customerEmail?.trim()) {
      errors.push("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      errors.push("Invalid email address");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await toast.promise(
        axios.put(
          `http://localhost:5500/api/customers/${editData._id}`,
          {
            ...editData,
            customerContactNumber: String(customerContactNumber), // 🔥 force string
          }
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
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>{c.customerId}</td>
                  <td>{c.customerName}</td>
                  <td>{c.customerContactNumber ?? "-"}</td>
                  <td>{c.customerEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="modal-bg">
          <div className="modal-box">

            <div className="modal-form">

              <input
                value={editData.customerName ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, customerName: e.target.value })
                }
              />

              <input
                maxLength={10}
                value={
                  editData.customerContactNumber !== undefined &&
                  editData.customerContactNumber !== null
                    ? String(editData.customerContactNumber)
                    : ""
                }
                onChange={(e) => {
                  if (!/^\d*$/.test(e.target.value)) return;
                  setEditData({
                    ...editData,
                    customerContactNumber: e.target.value,
                  });
                }}
              />

              <input
                value={editData.customerEmail ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, customerEmail: e.target.value })
                }
              />

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
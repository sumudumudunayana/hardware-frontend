import React, { useEffect, useState } from "react";
import api from "../../services/api";
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
      const res = await api.get("/customers");
      setCustomers(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load customers");
    }
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    if (!key.trim()) {
      setFiltered(customers);
      return;
    }

    setFiltered(
      customers.filter(
        (c) =>
          c.customerName.toLowerCase().includes(key) ||
          c.customerId?.toString() === key
      )
    );
  };

  const openUpdateModal = (customer) => {
    setEditData({
      ...customer,
      customerContactNumber:
        customer.customerContactNumber?.toString() || "",
    });

    setShowUpdateModal(true);
  };

  const submitUpdate = async () => {
    const {
      customerName,
      customerContactNumber,
      customerEmail,
    } = editData;

    const errors = [];

    if (!customerName?.trim()) {
      errors.push("Customer name is required");
    } else if (customerName.trim().length < 3) {
      errors.push("Name must be at least 3 characters");
    } else if (!/^[A-Za-z\s]+$/.test(customerName.trim())) {
      errors.push(
        "Customer name can contain only letters and spaces"
      );
    }

    if (!customerContactNumber?.trim()) {
      errors.push("Contact number is required");
    } else if (!/^\d{10}$/.test(customerContactNumber.trim())) {
      errors.push(
        "Contact number must be exactly 10 digits"
      );
    }

    if (!customerEmail?.trim()) {
      errors.push("Email is required");
    } else if (
      !/^\S+@\S+\.\S+$/.test(customerEmail.trim())
    ) {
      errors.push("Invalid email address");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      const payload = {
        ...editData,
        customerName: customerName.trim(),
        customerContactNumber:
          customerContactNumber.trim(),
        customerEmail: customerEmail
          .trim()
          .toLowerCase(),
      };

      const response = await api.put(
        `/customers/${editData._id}`,
        payload
      );

      const updatedCustomer = response.data;

      const updatedList = customers.map(
        (customer) =>
          customer._id === updatedCustomer._id
            ? updatedCustomer
            : customer
      );

      setCustomers(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);

      setEditData({
        _id: "",
        customerName: "",
        customerContactNumber: "",
        customerEmail: "",
      });

      toast.success(
        "Customer updated successfully!"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Update failed!"
      );
    }
  };

  const confirmDelete = async () => {
    try {
      await toast.promise(
        api.delete(`/customers/${deleteId}`),
        {
          loading: "Deleting customer...",
          success:
            "Customer deleted successfully!",
          error: "Delete failed!",
        }
      );

      const updated = customers.filter(
        (customer) =>
          customer._id !== deleteId
      );

      setCustomers(updated);
      setFiltered(updated);
      setShowDeleteModal(false);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="customer-page-wrapper">
      <div className="customer-card">
        <div className="customer-header">
          <span className="customer-badge">
            CUSTOMERS
          </span>
          <h1>Manage Customers</h1>
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
              {filtered.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.customerId}</td>
                  <td>
                    {customer.customerName}
                  </td>
                  <td>
                    {
                      customer.customerContactNumber
                    }
                  </td>
                  <td>
                    {customer.customerEmail}
                  </td>

                  <td className="actions">
                    <button
                      onClick={() =>
                        openUpdateModal(
                          customer
                        )
                      }
                    >
                      Update
                    </button>

                    <button
                      className="delete"
                      onClick={() => {
                        setDeleteId(
                          customer._id
                        );
                        setShowDeleteModal(
                          true
                        );
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
          <div className="modal-box">
            <h2>Edit Customer</h2>
            <p>
              Update customer details
              below
            </p>

            <div className="modal-form">
              <div className="modal-form-group">
                <label>
                  Customer Name
                </label>
                <input
                  type="text"
                  value={
                    editData.customerName ??
                    ""
                  }
                  placeholder="Enter customer full name"
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    if (
                      !/^[A-Za-z\s]*$/.test(
                        value
                      )
                    ) {
                      toast.error(
                        "Only letters and spaces allowed"
                      );
                      return;
                    }

                    setEditData({
                      ...editData,
                      customerName:
                        value,
                    });
                  }}
                />
              </div>

              <div className="modal-form-group">
                <label>
                  Contact Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={
                    editData.customerContactNumber ||
                    ""
                  }
                  placeholder="Enter 10 digit number"
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    if (
                      !/^\d*$/.test(
                        value
                      )
                    ) {
                      toast.error(
                        "Only numbers allowed"
                      );
                      return;
                    }

                    setEditData({
                      ...editData,
                      customerContactNumber:
                        value,
                    });
                  }}
                />
              </div>

              <div className="modal-form-group">
                <label>
                  Email Address
                </label>
                <input
                  type="email"
                  value={
                    editData.customerEmail ??
                    ""
                  }
                  placeholder="Enter email address"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      customerEmail:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() =>
                  setShowUpdateModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={submitUpdate}
              >
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
              <button
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
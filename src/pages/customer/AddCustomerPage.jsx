import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/customer/AddCustomerPageStyles.css";

export default function AddCustomerPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerContactNumber: "",
    customerEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number → digits only
    if (name === "customerContactNumber") {
      if (!/^\d*$/.test(value)) {
        toast.error("Only numbers are allowed for contact number");
        return;
      }
    }

    // Customer name → letters and spaces only
    if (name === "customerName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        toast.error("Customer name can contain only letters and spaces");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { customerName, customerContactNumber, customerEmail } = formData;

    const errors = [];

    // Name validation
    if (!customerName.trim()) {
      errors.push("Customer name is required");
    } else if (customerName.trim().length < 3) {
      errors.push("Customer name must be at least 3 characters");
    } else if (!/^[A-Za-z\s]+$/.test(customerName)) {
      errors.push("Customer name can contain only letters and spaces");
    }

    // Phone validation
    if (!customerContactNumber) {
      errors.push("Contact number is required");
    } else if (!/^\d{10}$/.test(customerContactNumber)) {
      errors.push("Contact number must be exactly 10 digits");
    }

    // Email validation
    if (!customerEmail.trim()) {
      errors.push("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      errors.push("Invalid email address");
    }

    // Show all validation errors
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await toast.promise(
        api.post("/customers", {
          customerName: customerName.trim(),
          customerContactNumber,
          customerEmail: customerEmail.trim().toLowerCase(),
        }),
        {
          loading: "Adding customer...",
          success: "Customer added successfully!",
          error: (err) =>
            err.response?.data?.message || "Failed to add customer",
        },
      );

      // Reset form
      setFormData({
        customerName: "",
        customerContactNumber: "",
        customerEmail: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="add-customer-wrapper">
      <div className="add-customer-card">
        <div className="add-customer-header">
          <span className="add-customer-badge">CUSTOMER</span>
          <h1>Add New Customer</h1>
        </div>

        <form className="add-customer-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="customerContactNumber"
            placeholder="Contact Number (10 digits)"
            value={formData.customerContactNumber}
            onChange={handleChange}
            maxLength={10}
          />

          <input
            type="text"
            name="customerEmail"
            placeholder="Customer Email"
            value={formData.customerEmail}
            onChange={handleChange}
          />

          <button type="submit" className="add-customer-btn">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

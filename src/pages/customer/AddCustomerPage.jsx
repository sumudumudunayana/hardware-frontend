import React, { useState } from "react";
import axios from "axios";
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

    // ✅ Prevent letters in phone number
    if (name === "customerContactNumber") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { customerName, customerContactNumber, customerEmail } = formData;

    const errors = [];

    // 🔴 Name validation
    if (!customerName.trim()) {
      errors.push("Customer name is required");
    } else if (customerName.length < 3) {
      errors.push("Customer name must be at least 3 characters");
    }

    // 🔴 Phone validation
    if (!customerContactNumber) {
      errors.push("Contact number is required");
    } else if (!/^\d{10}$/.test(customerContactNumber)) {
      errors.push("Contact number must be exactly 10 digits");
    }

    // 🔴 Email validation
    if (!customerEmail.trim()) {
      errors.push("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      errors.push("Invalid email address");
    }

    // 🔴 Show all errors at once
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await toast.promise(
        axios.post("http://localhost:5500/api/customers", formData),
        {
          loading: "Adding customer...",
          success: "Customer added successfully!",
          error: "Failed to add customer",
        }
      );

      // Reset form
      setFormData({
        customerName: "",
        customerContactNumber: "",
        customerEmail: "",
      });

    } catch (error) {
      toast.error("Error", {
        description:
          error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="add-customer-wrapper">
      <div className="add-customer-card">

        <div className="add-customer-header">
          <span className="add-customer-badge">CUSTOMER</span>
          <h1>Add New Customer</h1>
          <p>Register a new customer into the system</p>
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
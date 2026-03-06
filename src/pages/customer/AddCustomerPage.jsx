import React, { useState } from "react";
import axios from "axios";
import "../../css/customer/AddCustomerPageStyles.css";

export default function AddCustomerPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerContactNumber: "",
    customerEmail: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // PHONE VALIDATION (10 digits)
    if (!/^\d{10}$/.test(formData.customerContactNumber)) {
      alert("Contact number must be exactly 10 digits.");
      return;
    }

    // EMAIL VALIDATION
    if (!/^\S+@\S+\.\S+$/.test(formData.customerEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:5500/api/customers", formData);

      alert("Customer Added Successfully!");

      setFormData({
        customerName: "",
        customerContactNumber: "",
        customerEmail: "",
      });
    } catch (error) {
      console.error("Error adding customer:", error.response?.data);
      alert(error.response?.data?.message || "Failed to add customer.");
    }
  };

  return (
    <div className="add-customer-container">
      <div className="add-customer-overlay"></div>
      <div className="add-customer-card">
        <h1 className="add-customer-title">Add New Customer</h1>
        <form className="add-customer-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="customerContactNumber"
            placeholder="Contact Number"
            value={formData.customerContactNumber}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="customerEmail"
            placeholder="Customer Email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-customer-btn">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

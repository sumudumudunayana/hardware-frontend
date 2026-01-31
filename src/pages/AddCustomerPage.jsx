import React, { useState } from "react";
import axios from "axios";
import "../css/AddCustomerPageStyles.css";

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
    try {
      await axios.post("http://localhost:8080/customer/add-customer", formData);
      alert("Customer Added Successfully!");
      setFormData({
        customerName: "",
        customerContactNumber: "",
        customerEmail: "",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer.");
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
            required/>
          <input
            type="number"
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

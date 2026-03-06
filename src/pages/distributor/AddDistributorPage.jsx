import React, { useState } from "react";
import axios from "axios";
import "../../css/distributor/AddDistributorPageStyles.css";

export default function AddDistributorPage() {
  const [formData, setFormData] = useState({
    distributorName: "",
    distributorDescription: "",
    distributorContactNumber: "",
    distributorEmail: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        distributorContactNumber: Number(formData.distributorContactNumber),
      };

      await axios.post("http://localhost:5500/api/distributors", payload);

      alert("Distributor Added Successfully!");

      setFormData({
        distributorName: "",
        distributorDescription: "",
        distributorContactNumber: "",
        distributorEmail: "",
      });
    } catch (error) {
      console.error("Error adding distributor:", error.response?.data);
      alert("Failed to add distributor.");
    }
  };

  return (
    <div className="add-distributor-container">
      <div className="add-distributor-overlay"></div>
      <div className="add-distributor-card">
        <h1 className="add-distributor-title">Add New Supplier</h1>
        <form className="add-distributor-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="distributorName"
            placeholder="Supplier Name"
            value={formData.distributorName}
            onChange={handleChange}
            required
          />
          <textarea
            name="distributorDescription"
            placeholder="Supplier Description"
            value={formData.distributorDescription}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="number"
            name="distributorContactNumber"
            placeholder="Contact Number"
            value={formData.distributorContactNumber}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="distributorEmail"
            placeholder="Supplier Email"
            value={formData.distributorEmail}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-distributor-btn">
            Add Supplier
          </button>
        </form>
      </div>
    </div>
  );
}

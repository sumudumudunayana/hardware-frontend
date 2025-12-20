import React, { useState } from "react";
import axios from "axios";
import "../css/AddDistributorPageStyles.css";

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
      await axios.post(
        "http://localhost:8080/distributor/add-distributor",
        formData
      );

      alert("Distributor Added Successfully!");

      setFormData({
        distributorName: "",
        distributorDescription: "",
        distributorContactNumber: "",
        distributorEmail: "",
      });
    } catch (error) {
      console.error("Error adding distributor:", error);
      alert("Failed to add distributor.");
    }
  };

  return (
    <div className="add-distributor-container">
      <div className="add-distributor-overlay"></div>

      <div className="add-distributor-card">
        <h1 className="add-distributor-title">Add New Distributor</h1>

        <form className="add-distributor-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="distributorName"
            placeholder="Distributor Name"
            value={formData.distributorName}
            onChange={handleChange}
            required
          />

          <textarea
            name="distributorDescription"
            placeholder="Distributor Description"
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
            placeholder="Distributor Email"
            value={formData.distributorEmail}
            onChange={handleChange}
            required
          />

          <button type="submit" className="add-distributor-btn">
            Add Distributor
          </button>
        </form>
      </div>
    </div>
  );
}

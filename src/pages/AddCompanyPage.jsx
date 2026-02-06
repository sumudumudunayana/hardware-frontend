import React, { useState } from "react";
import axios from "axios";
import "../css/AddCompanyPageStyles.css";

export default function AddCompanyPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyAddress: "",
    companyContactNumber: "",
    companyEmail: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/company/add-company", formData);
      alert("Company Added Successfully!");
      setFormData({
        companyName: "",
        companyDescription: "",
        companyAddress: "",
        companyContactNumber: "",
        companyEmail: "",
      });
    } catch (error) {
      console.error("Error adding company:", error);
      alert("Failed to add company.");
    }
  };

  return (
    <div className="add-company-container">
      <div className="add-company-overlay"></div>
      <div className="add-company-card">
        <h1 className="add-company-title">Add New Company</h1>
        <form className="add-company-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <textarea
            name="companyDescription"
            placeholder="Company Description"
            value={formData.companyDescription}
            onChange={handleChange}
            required>
          </textarea>
          <input
            type="text"
            name="companyAddress"
            placeholder="Company Address"
            value={formData.companyAddress}
            onChange={handleChange}
            required/>
          <input
            type="number"
            name="companyContactNumber"
            placeholder="Contact Number"
            value={formData.companyContactNumber}
            onChange={handleChange}
            required/>
          <input
            type="email"
            name="companyEmail"
            placeholder="Company Email"
            value={formData.companyEmail}
            onChange={handleChange}
            required/>
          <button type="submit" className="add-company-btn">
            Add Company
          </button>
        </form>
      </div>
    </div>
  );
}

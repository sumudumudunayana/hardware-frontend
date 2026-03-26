import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../../css/distributor/AddDistributorPageStyles.css";

export default function AddDistributorPage() {
  const [formData, setFormData] = useState({
    distributorName: "",
    distributorDescription: "",
    distributorContactNumber: "",
    distributorEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Allow only numbers for phone input
    if (name === "distributorContactNumber") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    } = formData;

    const errors = [];

    // 🔴 Name validation
    if (!distributorName?.trim()) {
      errors.push("Supplier name is required");
    } else if (distributorName.trim().length < 2) {
      errors.push("Supplier name must be at least 2 characters");
    }

    // 🔴 Description validation
    if (!distributorDescription?.trim()) {
      errors.push("Description is required");
    }

    // 🔴 Phone validation (SAFE)
    if (!distributorContactNumber?.toString().trim()) {
      errors.push("Contact number is required");
    } else if (!/^\d{10}$/.test(distributorContactNumber)) {
      errors.push("Contact number must be exactly 10 digits");
    }

    // 🔴 Email validation
    if (!distributorEmail?.trim()) {
      errors.push("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(distributorEmail)) {
      errors.push("Invalid email address");
    }

    // 🔴 Show all errors
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      const payload = {
        ...formData,
        distributorContactNumber: distributorContactNumber, // ✅ FIXED (STRING)
      };

      await toast.promise(
        axios.post("http://localhost:5500/api/distributors", payload),
        {
          loading: "Adding supplier...",
          success: "Supplier added successfully!",
          error: "Failed to add supplier",
        }
      );

      // Reset form
      setFormData({
        distributorName: "",
        distributorDescription: "",
        distributorContactNumber: "",
        distributorEmail: "",
      });

    } catch (error) {
      toast.error("Error", {
        description:
          error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="supplier-page-wrapper">
      <div className="supplier-card">

        <div className="supplier-header">
          <span className="supplier-badge">SUPPLIER</span>
          <h1>Add Supplier</h1>
          <p>Register new supplier details into the system</p>
        </div>

        <form className="supplier-form" onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="distributorName"
            placeholder="Supplier Name"
            value={formData.distributorName}
            onChange={handleChange}
          />

          <textarea
            name="distributorDescription"
            placeholder="Supplier Description"
            value={formData.distributorDescription}
            onChange={handleChange}
          />

          <input
            type="text"
            name="distributorContactNumber"
            placeholder="Contact Number (10 digits)"
            value={formData.distributorContactNumber}
            onChange={handleChange}
            maxLength={10}
          />

          <input
            type="text"
            name="distributorEmail"
            placeholder="Supplier Email"
            value={formData.distributorEmail}
            onChange={handleChange}
          />

          <button type="submit">Add Supplier</button>
        </form>

      </div>
    </div>
  );
}
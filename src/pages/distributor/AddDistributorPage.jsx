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

    // ✅ Allow only numbers for phone
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

    // ✅ Name validation
    if (!distributorName.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    if (distributorName.length < 3) {
      toast.warning("Name too short", {
        description: "Must be at least 3 characters",
      });
      return;
    }

    // ✅ Description validation
    if (!distributorDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    // ✅ Phone validation
    if (!/^\d{10}$/.test(distributorContactNumber)) {
      toast.error("Invalid contact number", {
        description: "Must be exactly 10 digits",
      });
      return;
    }

    // ✅ Email validation
    if (!/^\S+@\S+\.\S+$/.test(distributorEmail)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      const payload = {
        ...formData,
        distributorContactNumber: Number(distributorContactNumber),
      };

      await toast.promise(
        axios.post("http://localhost:5500/api/distributors", payload),
        {
          loading: "Adding supplier...",
          success: "Supplier added successfully!",
          error: "Failed to add supplier",
        }
      );

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
    <div className="distributor-page-wrapper">
      <div className="distributor-card">

        <div className="distributor-header">
          <span className="badge">SUPPLIER</span>
          <h1>Add Supplier</h1>
          <p>Register new supplier details into the system</p>
        </div>

        <form className="distributor-form" onSubmit={handleSubmit}>
          
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
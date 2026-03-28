import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/company/AddCompanyPageStyles.css";

export default function AddCompanyPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyAddress: "",
    companyContactNumber: "",
    companyEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    //  Only numbers for phone
    if (name === "companyContactNumber") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      companyName,
      companyDescription,
      companyAddress,
      companyContactNumber,
      companyEmail,
    } = formData;

    //  Name validation
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (companyName.length < 3) {
      toast.warning("Name too short", {
        description: "Must be at least 3 characters",
      });
      return;
    }

    //  Description validation
    if (!companyDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    //  Address validation
    if (!companyAddress.trim()) {
      toast.error("Address is required");
      return;
    }

    //  Phone validation
    if (!/^\d{10}$/.test(companyContactNumber)) {
      toast.error("Invalid contact number", {
        description: "Must be exactly 10 digits",
      });
      return;
    }

    //  Email validation
    if (!/^\S+@\S+\.\S+$/.test(companyEmail)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      const payload = {
        ...formData,
        companyContactNumber: Number(companyContactNumber),
      };

      await toast.promise(
        api.post("/companies", payload),
        {
          loading: "Adding company...",
          success: "Company added successfully!",
          error: "Failed to add company",
        }
      );

      setFormData({
        companyName: "",
        companyDescription: "",
        companyAddress: "",
        companyContactNumber: "",
        companyEmail: "",
      });

    } catch (error) {
      toast.error("Error", {
        description:
          error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="company-page-wrapper">
      <div className="company-card">

        <div className="company-header">
          <span className="company-badge">COMPANY</span>
          <h1>Add New Company</h1>
        </div>

        <form className="company-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <textarea
            name="companyDescription"
            placeholder="Company Description"
            value={formData.companyDescription}
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyAddress"
            placeholder="Company Address"
            value={formData.companyAddress}
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyContactNumber"
            placeholder="Contact Number (10 digits)"
            value={formData.companyContactNumber}
            onChange={handleChange}
            maxLength={10}
          />

          <input
            type="text"
            name="companyEmail"
            placeholder="Company Email"
            value={formData.companyEmail}
            onChange={handleChange}
          />

          <button type="submit">Add Company</button>
        </form>
      </div>
    </div>
  );
}
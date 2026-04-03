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

    // phone → only numbers
    if (name === "companyContactNumber") {
      if (!/^\d*$/.test(value)) {
        toast.error(
          "Only numbers are allowed for contact number"
        );
        return;
      }
    }

    // company name → letters + spaces only
    if (name === "companyName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        toast.error(
          "Company name can contain only letters and spaces"
        );
        return;
      }
    }

    // address → letters + numbers + spaces + , . / -
    if (name === "companyAddress") {
      if (!/^[A-Za-z0-9\s,./-]*$/.test(value)) {
        toast.error(
          "Address contains invalid symbols"
        );
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
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

    const errors = [];

    // name validation
    if (!companyName.trim()) {
      errors.push("Company name is required");
    } else if (
      companyName.trim().length < 3
    ) {
      errors.push(
        "Company name must be at least 3 characters"
      );
    } else if (
      !/^[A-Za-z\s]+$/.test(
        companyName
      )
    ) {
      errors.push(
        "Company name can contain only letters and spaces"
      );
    }

    // description
    if (
      !companyDescription.trim()
    ) {
      errors.push(
        "Description is required"
      );
    }

    // address
    if (!companyAddress.trim()) {
      errors.push("Address is required");
    } else if (
      !/^[A-Za-z0-9\s,./-]+$/.test(
        companyAddress
      )
    ) {
      errors.push(
        "Address contains invalid symbols"
      );
    }

    // phone
    if (
      !/^\d{10}$/.test(
        companyContactNumber
      )
    ) {
      errors.push(
        "Contact number must be exactly 10 digits"
      );
    }

    // email
    if (
      !/^\S+@\S+\.\S+$/.test(
        companyEmail
      )
    ) {
      errors.push(
        "Invalid email address"
      );
    }

    if (errors.length > 0) {
      errors.forEach((err) =>
        toast.error(err)
      );
      return;
    }

    try {
      await toast.promise(
        api.post("/companies", {
          companyName:
            companyName.trim(),
          companyDescription:
            companyDescription.trim(),
          companyAddress:
            companyAddress.trim(),
          companyContactNumber,
          companyEmail:
            companyEmail
              .trim()
              .toLowerCase(),
        }),
        {
          loading:
            "Adding company...",
          success:
            "Company added successfully!",
          error: (err) =>
            err.response?.data
              ?.message ||
            "Failed to add company",
        }
      );

      setFormData({
        companyName: "",
        companyDescription: "",
        companyAddress: "",
        companyContactNumber:
          "",
        companyEmail: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="company-page-wrapper">
      <div className="company-card">
        <div className="company-header">
          <span className="company-badge">
            COMPANY
          </span>
          <h1>
            Add New Company
          </h1>
        </div>

        <form
          className="company-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={
              formData.companyName
            }
            onChange={handleChange}
          />

          <textarea
            name="companyDescription"
            placeholder="Company Description"
            value={
              formData.companyDescription
            }
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyAddress"
            placeholder="Company Address"
            value={
              formData.companyAddress
            }
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyContactNumber"
            placeholder="Contact Number (10 digits)"
            value={
              formData.companyContactNumber
            }
            onChange={handleChange}
            maxLength={10}
          />

          <input
            type="text"
            name="companyEmail"
            placeholder="Company Email"
            value={
              formData.companyEmail
            }
            onChange={handleChange}
          />

          <button type="submit">
            Add Company
          </button>
        </form>
      </div>
    </div>
  );
}
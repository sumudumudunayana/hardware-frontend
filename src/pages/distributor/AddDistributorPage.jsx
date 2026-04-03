import React, { useState } from "react";
import api from "../../services/api";
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

    // phone → only numbers
    if (name === "distributorContactNumber") {
      if (!/^\d*$/.test(value)) {
        toast.error(
          "Only numbers are allowed for contact number"
        );
        return;
      }
    }

    // supplier name → letters + spaces only
    if (name === "distributorName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        toast.error(
          "Supplier name can contain only letters and spaces"
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
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    } = formData;

    const errors = [];

    // name validation
    if (!distributorName?.trim()) {
      errors.push("Supplier name is required");
    } else if (
      distributorName.trim().length < 2
    ) {
      errors.push(
        "Supplier name must be at least 2 characters"
      );
    } else if (
      !/^[A-Za-z\s]+$/.test(
        distributorName
      )
    ) {
      errors.push(
        "Supplier name can contain only letters and spaces"
      );
    }

    // description validation
    if (
      !distributorDescription?.trim()
    ) {
      errors.push(
        "Description is required"
      );
    }

    // phone validation
    if (
      !distributorContactNumber
        ?.toString()
        .trim()
    ) {
      errors.push(
        "Contact number is required"
      );
    } else if (
      !/^\d{10}$/.test(
        distributorContactNumber
      )
    ) {
      errors.push(
        "Contact number must be exactly 10 digits"
      );
    }

    // email validation
    if (
      !distributorEmail?.trim()
    ) {
      errors.push("Email is required");
    } else if (
      !/^\S+@\S+\.\S+$/.test(
        distributorEmail
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
        api.post("/distributors", {
          distributorName:
            distributorName.trim(),
          distributorDescription:
            distributorDescription.trim(),
          distributorContactNumber,
          distributorEmail:
            distributorEmail
              .trim()
              .toLowerCase(),
        }),
        {
          loading:
            "Adding supplier...",
          success:
            "Supplier added successfully!",
          error: (err) =>
            err.response?.data
              ?.message ||
            "Failed to add supplier",
        }
      );

      setFormData({
        distributorName: "",
        distributorDescription: "",
        distributorContactNumber:
          "",
        distributorEmail: "",
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
    <div className="supplier-page-wrapper">
      <div className="supplier-card">
        <div className="supplier-header">
          <span className="supplier-badge">
            SUPPLIER
          </span>
          <h1>Add Supplier</h1>
        </div>

        <form
          className="supplier-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="distributorName"
            placeholder="Supplier Name"
            value={
              formData.distributorName
            }
            onChange={handleChange}
          />

          <textarea
            name="distributorDescription"
            placeholder="Supplier Description"
            value={
              formData.distributorDescription
            }
            onChange={handleChange}
          />

          <input
            type="text"
            name="distributorContactNumber"
            placeholder="Contact Number (10 digits)"
            value={
              formData.distributorContactNumber
            }
            onChange={handleChange}
            maxLength={10}
          />

          <input
            type="text"
            name="distributorEmail"
            placeholder="Supplier Email"
            value={
              formData.distributorEmail
            }
            onChange={handleChange}
          />

          <button type="submit">
            Add Supplier
          </button>
        </form>
      </div>
    </div>
  );
}
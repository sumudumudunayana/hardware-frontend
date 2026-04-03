import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/promotion/AddPromotionPageStyles.css";

export default function AddPromotionPage() {
  const [formData, setFormData] = useState({
    promotionName: "",
    promotionDescription: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    applyTo: "all",
    itemId: "",
    status: "active",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch {
      toast.error("Failed to load items");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Promotion name → letters + spaces only
    if (name === "promotionName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        toast.error("Promotion name can contain only letters and spaces");
        return;
      }
    }

    // Prevent negative discount
    if (name === "discountValue" && Number(value) < 0) {
      toast.error("Discount cannot be negative");
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      promotionName,
      promotionDescription,
      discountType,
      discountValue,
      startDate,
      endDate,
      applyTo,
      itemId,
    } = formData;

    const discount = Number(discountValue);

    // Promotion name validation
    if (!promotionName.trim()) {
      toast.error("Promotion name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(promotionName.trim())) {
      toast.error("Promotion name can contain only letters and spaces");
      return;
    }

    if (promotionName.trim().length < 3) {
      toast.error("Promotion name must be at least 3 characters");
      return;
    }

    // Description
    if (!promotionDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    // Discount validation
    if (discountValue === "") {
      toast.error("Discount value is required");
      return;
    }

    if (discount < 0) {
      toast.error("Discount cannot be negative");
      return;
    }

    if (discountType === "percentage" && discount > 100) {
      toast.error("Percentage cannot exceed 100%");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (applyTo === "specific" && !itemId) {
      toast.error("Please select an item");
      return;
    }

    try {
      await toast.promise(
        api.post("/promotions", {
          ...formData,
          promotionName: promotionName.trim(),
          discountValue: discount,
        }),
        {
          loading: "Creating promotion...",
          success: "Promotion created successfully!",
          error: (err) =>
            err.response?.data?.message || "Failed to create promotion",
        },
      );

      setFormData({
        promotionName: "",
        promotionDescription: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        applyTo: "all",
        itemId: "",
        status: "active",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create promotion");
    }
  };

  return (
    <div className="prm-wrapper">
      <div className="prm-card">
        <div className="prm-header">
          <span className="prm-badge">PROMOTION</span>
          <h1>Add Promotion</h1>
        </div>

        <form className="prm-form" onSubmit={handleSubmit}>
          <input
            name="promotionName"
            placeholder="Promotion Name"
            value={formData.promotionName}
            onChange={handleChange}
          />

          <textarea
            name="promotionDescription"
            placeholder="Promotion Description"
            value={formData.promotionDescription}
            onChange={handleChange}
          />

          <div className="prm-row">
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>

            <input
              type="number"
              min="0"
              name="discountValue"
              placeholder="Value"
              value={formData.discountValue}
              onChange={handleChange}
            />
          </div>

          <div className="prm-row">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="prm-row">
            <select
              name="applyTo"
              value={formData.applyTo}
              onChange={handleChange}
            >
              <option value="all">All Items</option>
              <option value="specific">Specific Item</option>
            </select>

            {formData.applyTo === "specific" && (
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="prm-btn">Create Promotion</button>
        </form>
      </div>
    </div>
  );
}

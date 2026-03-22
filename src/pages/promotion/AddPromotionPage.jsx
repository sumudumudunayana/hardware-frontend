import React, { useEffect, useState } from "react";
import axios from "axios";
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
    const loadItems = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/items");
        setItems(res.data);
      } catch {
        toast.error("Failed to load items");
      }
    };
    loadItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Prevent negative discount
    if (name === "discountValue" && Number(value) < 0) return;

    setFormData({ ...formData, [name]: value });
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

    // ✅ Name validation
    if (!promotionName.trim()) {
      toast.error("Promotion name is required");
      return;
    }

    if (promotionName.length < 3) {
      toast.warning("Name too short", {
        description: "Must be at least 3 characters",
      });
      return;
    }

    // ✅ Description validation
    if (!promotionDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    // ✅ Discount validation
    if (discountValue === "") {
      toast.error("Discount value is required");
      return;
    }

    if (discount < 0) {
      toast.error("Discount cannot be negative");
      return;
    }

    // Percentage specific
    if (discountType === "percentage" && discount > 100) {
      toast.error("Invalid discount", {
        description: "Percentage cannot exceed 100%",
      });
      return;
    }

    // Fixed amount
    if (discountType === "fixed" && discount === 0) {
      toast.warning("Zero discount", {
        description: "This promotion has no effect",
      });
    }

    // ✅ Date validation
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (endDate < startDate) {
      toast.error("Invalid date range", {
        description: "End date must be after start date",
      });
      return;
    }

    // Optional: prevent past start date
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      toast.warning("Start date is in the past");
    }

    // ✅ Apply to specific item validation
    if (applyTo === "specific" && !itemId) {
      toast.error("Please select an item");
      return;
    }

    try {
      await toast.promise(
        axios.post("http://localhost:5500/api/promotions", {
          ...formData,
          discountValue: discount,
        }),
        {
          loading: "Creating promotion...",
          success: "Promotion created successfully!",
          error: "Failed to create promotion",
        }
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

    } catch (err) {}
  };

  return (
    <div className="prm-wrapper">

      <div className="prm-card">

        {/* HEADER */}
        <div className="prm-header">
          <span className="prm-badge">PROMOTION</span>
          <h1>Add Promotion</h1>
          <p>Create discounts and offers</p>
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

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="prm-btn">Create Promotion</button>

        </form>

      </div>
    </div>
  );
}
import { useState } from "react";
import api from "../api";
import "../css/AddItemStyles.css";

function AddItem() {
  const [item, setItem] = useState({
    itemName: "",
    itemDescription: "",
    itemCategory: "",
    itemCostPrice: "",
    itemSellingPrice: "",
    itemLabeledPrice: "",
    itemCompany: "",
    itemDistributor: "",
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...item,
      itemCostPrice: Number(item.itemCostPrice),
      itemSellingPrice: Number(item.itemSellingPrice),
      itemLabeledPrice: Number(item.itemLabeledPrice),
    };

    try {
      await api.post("/item/add-item", payload);
      alert("Item added successfully!");

      setItem({
        itemName: "",
        itemDescription: "",
        itemCategory: "",
        itemCostPrice: "",
        itemSellingPrice: "",
        itemLabeledPrice: "",
        itemCompany: "",
        itemDistributor: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item");
    }
  };

  // Format camelCase -> Normal Text (example: itemCostPrice → Item Cost Price)
  const formatLabel = (field) =>
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  return (
    <div className="add-item-page">
      <div className="add-item-container">
        <h2 className="add-item-title">Add New Item</h2>

        <form onSubmit={handleSubmit} className="add-item-form">
          {Object.keys(item).map((field) => (
            <div key={field} className="add-item-field">
              <label className="add-item-label">{formatLabel(field)}</label>

              <input
                type={field.toLowerCase().includes("price") ? "number" : "text"}
                step="0.01"
                name={field}
                value={item[field]}
                onChange={handleChange}
                className="add-item-input"
              />
            </div>
          ))}

          {/* Button spans two columns */}
          <div className="full-width">
            <button type="submit" className="add-item-button">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;

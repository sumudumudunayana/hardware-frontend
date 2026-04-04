import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import "../../css/item/UpdateItemPageStyles.css";

export default function UpdateItemPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [distributors, setDistributors] = useState([]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadItems();
    loadDropdownData();
  }, []);

  const loadItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load items");
    }
  };

  const loadDropdownData = async () => {
    try {
      const [cat, com, dist] = await Promise.all([
        api.get("/categories"),
        api.get("/companies"),
        api.get("/distributors"),
      ]);

      setCategories(cat.data);
      setCompanies(com.data);
      setDistributors(dist.data);
    } catch {
      toast.error("Failed to load dropdown data");
    }
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();

    setFiltered(
      key
        ? items.filter(
            (item) =>
              item.itemName.toLowerCase().includes(key) ||
              item.itemId.toString() === key,
          )
        : items,
    );
  };

  // UPDATE VALIDATION
  const submitUpdate = async () => {
    const itemName = editData.itemName?.trim();
    const cost = Number(editData.itemCostPrice);
    const selling = Number(editData.itemSellingPrice);
    const labeled = Number(editData.itemLabeledPrice);

    // validations
    if (!itemName) {
      toast.error("Item name is required");
      return;
    }

    if (!/^[A-Za-z0-9\s]+$/.test(itemName)) {
      toast.error("Item name can contain only letters, numbers, and spaces");
      return;
    }

    if (/^\d+$/.test(itemName)) {
      toast.error("Item name cannot contain only numbers");
      return;
    }

    if (!editData.itemCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!editData.itemCompany) {
      toast.error("Please select a company");
      return;
    }

    if (!editData.itemDistributor) {
      toast.error("Please select a supplier");
      return;
    }

    if (cost < 0 || selling < 0 || labeled < 0) {
      toast.error("Prices cannot be negative");
      return;
    }

    if (selling <= cost) {
      toast.error("Selling price must be greater than cost price");
      return;
    }

    if (labeled <= selling || labeled <= cost) {
      toast.error("Labeled price must be greater than selling and cost price");
      return;
    }

    try {
      const response = await api.put(`/items/${editData._id}`, {
        ...editData,
        itemName,
        itemCostPrice: cost,
        itemSellingPrice: selling,
        itemLabeledPrice: labeled,
      });

      const updatedItem = response.data;

      const updatedList = items.map((item) =>
        item._id === updatedItem._id ? updatedItem : item,
      );

      setItems(updatedList);
      setFiltered(updatedList);

      setShowUpdateModal(false);

      toast.success("Item updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    }
  };

  // DELETE
  const confirmDelete = async () => {
    try {
      await toast.promise(api.delete(`/items/${deleteId}`), {
        loading: "Deleting item...",
        success: "Item deleted successfully!",
        error: "Delete failed!",
      });

      const updatedList = items.filter((item) => item._id !== deleteId);

      setItems(updatedList);
      setFiltered(updatedList);

      setShowDeleteModal(false);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="update-wrapper">
      <div className="update-card">
        <div className="update-header">
          <span className="update-badge">PRODUCT MANAGEMENT</span>
          <h1>Update Items</h1>
        </div>

        <input
          className="update-search"
          placeholder="Search by ID or Name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            autoSearch(e.target.value);
          }}
        />

        <div className="table-wrapper">
          <table className="update-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Selling</th>
                <th>Cost</th>
                <th>Company</th>
                <th>Supplier</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item._id}>
                  <td>{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>{item.itemCategory}</td>
                  <td>{item.itemSellingPrice}</td>
                  <td>{item.itemCostPrice}</td>
                  <td>{item.itemCompany}</td>
                  <td>{item.itemDistributor}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-update"
                      onClick={() => {
                        setEditData(item);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => {
                        setDeleteId(item._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="item-modal-bg">
          <div className="item-modal-box">
            <div className="item-modal-header">
              <h2>Edit Item</h2>
              <p>Update item details below</p>
            </div>

            <div className="item-modal-form">
              <div className="item-form-group">
                <label>Item Name</label>
                <input
                  className="item-input"
                  value={editData.itemName || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^[A-Za-z0-9\s]*$/.test(value)) {
                      toast.error("Only letters, numbers, and spaces allowed");
                      return;
                    }

                    setEditData({
                      ...editData,
                      itemName: value,
                    });
                  }}
                />
              </div>

              <div className="item-form-group">
                <label>Category</label>
                <select
                  className="item-select"
                  value={editData.itemCategory || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemCategory: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.categoryName}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="item-form-group">
                <label>Company</label>
                <select
                  className="item-select"
                  value={editData.itemCompany || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemCompany: e.target.value,
                    })
                  }
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c.companyName}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="item-form-group">
                <label>Supplier</label>
                <select
                  className="item-select"
                  value={editData.itemDistributor || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemDistributor: e.target.value,
                    })
                  }
                >
                  <option value="">Select Supplier</option>
                  {distributors.map((d) => (
                    <option key={d._id} value={d.distributorName}>
                      {d.distributorName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="item-form-group">
                <label>Cost Price</label>
                <input
                  className="item-input"
                  type="number"
                  value={editData.itemCostPrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemCostPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="item-form-group">
                <label>Selling Price</label>
                <input
                  className="item-input"
                  type="number"
                  value={editData.itemSellingPrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemSellingPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="item-form-group">
                <label>Labeled Price</label>
                <input
                  className="item-input"
                  type="number"
                  value={editData.itemLabeledPrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemLabeledPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="item-modal-actions">
              <button
                className="item-btn-secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>

              <button className="item-btn-primary" onClick={submitUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <div className="delete-confirm-header">
              <h2>Delete Item</h2>
              <p>This action cannot be undone</p>
            </div>

            <div className="delete-confirm-text">
              Are you sure you want to permanently delete this item?
            </div>

            <div className="delete-confirm-actions">
              <button
                className="delete-confirm-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

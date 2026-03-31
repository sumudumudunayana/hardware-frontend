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
    const res = await api.get("/items");
    setItems(res.data);
    setFiltered(res.data);
  };

  const loadDropdownData = async () => {
    const [cat, com, dist] = await Promise.all([
      api.get("/categories"),
      api.get("/companies"),
      api.get("/distributors"),
    ]);
    setCategories(cat.data);
    setCompanies(com.data);
    setDistributors(dist.data);
  };

  const autoSearch = (text) => {
    const key = text.toLowerCase();
    setFiltered(
      key
        ? items.filter(
            (i) =>
              i.itemName.toLowerCase().includes(key) ||
              i.itemId.toString() === key,
          )
        : items,
    );
  };

  //  UPDATE WITH VALIDATION
  const submitUpdate = async () => {
    const cost = Number(editData.itemCostPrice);
    const selling = Number(editData.itemSellingPrice);

    // Validation
    if (!editData.itemName || !editData.itemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (cost < 0 || selling < 0) {
      toast.error("Invalid price", {
        description: "Prices cannot be negative",
      });
      return;
    }

    if (selling < cost) {
      toast.warning("Check pricing", {
        description: "Selling price should be higher than cost price",
      });
      return;
    }

    try {
      await toast.promise(
        api.put(`/items/${editData._id}`, {
          ...editData,
          itemSellingPrice: selling,
          itemCostPrice: cost,
        }),
        {
          loading: "Updating item...",
          success: "Item updated successfully!",
          error: "Update failed!",
        },
      );

      loadItems();
      setShowUpdateModal(false);
    } catch (err) {
      // handled by toast.promise
    }
  };

  // DELETE WITH TOAST
  const confirmDelete = async () => {
    try {
      await toast.promise(
        api.delete(`/items/${deleteId}`),
        {
          loading: "Deleting item...",
          success: "Item deleted successfully!",
          error: "Delete failed!",
        },
      );

      loadItems();
      setShowDeleteModal(false);
    } catch (err) {}
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

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Edit Item</h2>
              <p>Update item details below</p>
            </div>

            <div className="modal-form">
              {/* Item Name */}
              <div className="form-group">
                <label>Item Name</label>
                <input
                  name="itemName"
                  placeholder="Enter item name"
                  value={editData.itemName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, itemName: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editData.itemCategory || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, itemCategory: e.target.value })
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

              {/* Selling Price */}
              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter selling price"
                  value={editData.itemSellingPrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemSellingPrice: e.target.value,
                    })
                  }
                />
              </div>

              {/* Cost Price */}
              <div className="form-group">
                <label>Cost Price</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter cost price"
                  value={editData.itemCostPrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      itemCostPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>

              <button className="btn-primary" onClick={submitUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-bg">
          <div className="modal-box delete-modal">
            <div className="modal-header">
              <h2>Delete Item</h2>
              <p>This action cannot be undone</p>
            </div>

            <div className="modal-delete-text">
              Are you sure you want to delete this item?
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

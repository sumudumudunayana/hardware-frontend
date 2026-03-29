import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/item/ViewItemPageStyles.css";

export default function ViewItemPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await api.get("/items");
        setItems(res.data);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };

    loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(keyword) ||
      item.itemId.toString() === keyword
    );
  });

  return (
    <div className="view-page-wrapper">

      <div className="view-card">

        <div className="view-header">
          <span className="view-badge">PRODUCT INVENTORY</span>
          <h1>View Items</h1>
        </div>

        <input
          type="text"
          className="view-search"
          placeholder="Search by ID or Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-wrapper">
          <table className="item-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Selling</th>
                <th>Cost</th>
                <th>Company</th>
                <th>Supplier</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.itemId}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemCategory}</td>
                    <td>{item.itemSellingPrice}</td>
                    <td>{item.itemCostPrice}</td>
                    <td>{item.itemCompany}</td>
                    <td>{item.itemDistributor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-items">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ViewItemPageStyles.css";

export default function ViewItemPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const loadItems = async () => {
    try {
      const res = await axios.get("http://localhost:8080/item/get-all");
      setItems(res.data);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(keyword) ||
      item.id.toString() === keyword
    );
  });

  return (
    <div className="view-container">
      <div className="view-overlay"></div>
      <div className="view-card">
        <h1 className="view-title">View Items</h1>
        <input
          type="text"
          className="search-bar"
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
                <th>Selling Price</th>
                <th>Cost Price</th>
                <th>Company</th>
                <th>Distributor</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
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
                    No items found.
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

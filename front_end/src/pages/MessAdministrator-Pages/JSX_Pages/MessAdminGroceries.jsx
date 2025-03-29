import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./adminNavbar";

const sessions = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const MessAdminGroceryPage = () => {
  const [groceries, setGroceries] = useState([]);
  const [filteredGroceries, setFilteredGroceries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    type: "",
    name: "",
    quantity: "",
    price: "",
    session: "Breakfast",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/groceries")
      .then((response) => {
        const sortedData = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setGroceries(sortedData);
        setFilteredGroceries(sortedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredGroceries(
      groceries.filter((item) => item.name.toLowerCase().includes(query))
    );
  };
  return (
    <>
      <AdminNavbar />
      <div className="supervisor-grocery-page">
        <div className="grocery-container">
          <h2 className="section-title">Grocery Inventory</h2>

          {/* Search Bar */}
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={handleSearch}
          />

          <table className="grocery-table">
            <thead>
              <tr>
                <th>Product No</th>
                <th>Name</th>
                <th>Quantity (kg/l)</th>
                <th>Cost per L/Kg</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroceries.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity_kg_l}</td>
                  <td>{parseFloat(item.cost_per_unit).toFixed(2)}</td>
                  <td>{parseFloat(item.total_cost).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MessAdminGroceryPage;

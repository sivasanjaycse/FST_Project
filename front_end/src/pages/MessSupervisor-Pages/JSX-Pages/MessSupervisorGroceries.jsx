import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/groceries.css";
import SupervisorNavbar from "./supervisorNavbar";

const sessions = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const MessSupervisorGroceryPage = () => {
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

  const handleOpenModal = (id, type) => {
    if (type === "addProduct") {
      setModalData({
        id: null,
        type,
        name: "",
        quantity: "",
        price: "",
        session: "Breakfast",
      });
    } else {
      setModalData({ id, type, quantity: "", price: "", session: "Breakfast" });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { id, type, name, quantity, price, session } = modalData;
    const todayDate = new Date().toISOString().split("T")[0];

    const requestData = {
      id,
      name,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date: todayDate,
      session,
    };

    const endpoint =
      type === "addProduct" ? "add-product" : type === "add" ? "add" : "take";

    axios
      .post(`http://localhost:5000/groceries/${endpoint}`, requestData)
      .then(() => {
        setShowModal(false);
        window.location.reload();
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  const handleRemoveProduct = (id) => {
    const product = groceries.find(item => item.id === id);
  
    if (!product) {
      alert("Product not found!");
      return;
    }
  
    if (product.quantity_kg_l > 0) {
      alert(`Cannot remove "${product.name}". Quantity is ${product.quantity_kg_l}.`);
      return;
    }
  
    axios
      .delete(`http://localhost:5000/groceries/${id}`)
      .then(response => {
        alert(response.data.message); // Show success message only if deleted
        fetchGroceries(); // Refresh list
      });
  };
  
  


  return (
    <>
      <SupervisorNavbar />
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
                <th>Add</th>
                <th>Take</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroceries.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity_kg_l}</td>
                  <td>{item.cost_per_unit}</td>
                  <td>{item.total_cost}</td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={() => handleOpenModal(item.id, "add")}
                    >
                      Add
                    </button>
                  </td>
                  <td>
                    <button
                      className="take-btn"
                      onClick={() => handleOpenModal(item.id, "take")}
                    >
                      Take
                    </button>
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveProduct(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Product Button */}
          <button
            className="add-product-btn"
            onClick={() => handleOpenModal(null, "addProduct")}
          >
            Add Product
          </button>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>
                  {modalData.type === "addProduct"
                    ? "Add New Product"
                    : modalData.type === "add"
                    ? "Add Quantity"
                    : "Take Quantity"}
                </h3>

                {modalData.type === "addProduct" && (
                  <input
                    type="text"
                    name="name"
                    className="modal-input"
                    placeholder="Enter Product Name"
                    value={modalData.name}
                    onChange={handleChange}
                  />
                )}

                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter Quantity"
                  value={modalData.quantity}
                  onChange={handleChange}
                />

                {/* Show Price Input for Add and Add Product */}
                {modalData.type !== "take" && (
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter Price per unit"
                    value={modalData.price}
                    onChange={handleChange}
                  />
                )}

                {/* Session Dropdown when Taking Groceries */}
                {modalData.type === "take" && (
                  <select
                    name="session"
                    value={modalData.session}
                    onChange={handleChange}
                  >
                    {sessions.map((session, index) => (
                      <option key={index} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                )}

                <button onClick={handleSubmit}>Submit</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessSupervisorGroceryPage;

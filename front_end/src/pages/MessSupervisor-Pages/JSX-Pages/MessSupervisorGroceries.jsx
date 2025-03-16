import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/groceries.css";

const MessSupervisorGroceryPage = () => {
  const [groceries, setGroceries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ id: null, type: "", quantity: "", price: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/groceries")
      .then(response => setGroceries(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleOpenModal = (id, type) => {
    setModalData({ id, type, quantity: "", price: "" });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { id, type, quantity, price } = modalData;
    const updateData = { quantity: parseFloat(quantity), price: parseFloat(price) };
    
    axios.post(`http://localhost:5000/groceries/${type}`, { id, ...updateData })
      .then(() => {
        setShowModal(false);
        window.location.reload();
      })
      .catch(error => console.error("Error updating data:", error));
  };

  return (
    <div className="grocery-page">
      <h2 className="section-title">Grocery Inventory</h2>
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
          </tr>
        </thead>
        <tbody>
          {groceries.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity_kg_l}</td>
              <td>{item.cost_per_unit}</td>
              <td>{item.total_cost}</td>
              <td><button className="add-btn" onClick={() => handleOpenModal(item.id, "add")}>Add</button></td>
              <td><button className="take-btn" onClick={() => handleOpenModal(item.id, "take")}>Take</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{modalData.type === "add" ? "Add Quantity" : "Take Quantity"}</h3>
            <input type="number" name="quantity" placeholder="Enter Quantity" value={modalData.quantity} onChange={handleChange} />
            {modalData.type === "add" && <input type="number" name="price" placeholder="Enter Price per unit" value={modalData.price} onChange={handleChange} />}
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessSupervisorGroceryPage;

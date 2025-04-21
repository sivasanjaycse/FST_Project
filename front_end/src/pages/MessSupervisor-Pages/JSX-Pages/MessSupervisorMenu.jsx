import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/messmenu.css";
import SupervisorNavbar from "./supervisorNavbar";
import { useParams } from "react-router-dom";
const MessSupervisorMenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedMenu, setUpdatedMenu] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false); // Overlay State
  const { messName } = useParams();
  useEffect(() => {
    axios
      .get("http://localhost:5000/menu/" + messName)
      .then((response) => {
        setMenu(response.data);
        setUpdatedMenu(response.data);
      })
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  const handleInputChange = (index, key, value) => {
    const newMenu = [...updatedMenu];
    newMenu[index][key] = value;
    setUpdatedMenu(newMenu);
  };

  const handleUpdate = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    axios
      .post("http://localhost:5000/update-menu", updatedMenu)
      .then(() => {
        setMenu(updatedMenu);
        setEditMode(false);
        setShowConfirmation(true); // Show confirmation overlay
      })
      .catch((error) => console.error("Error updating menu:", error));
  };

  return (
    <>
      <SupervisorNavbar />
      <div className="mess-menu-page">
        <div className="menu-container">
          <h2 className="section-title">Mess Menu</h2>

          <table className="mess-menu-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => (
                <tr key={index}>
                  <td>{item.day}</td>
                  <td>
                    {editMode ? (
                      <input
                        type="text"
                        value={updatedMenu[index].breakfast}
                        onChange={(e) =>
                          handleInputChange(index, "breakfast", e.target.value)
                        }
                      />
                    ) : (
                      item.breakfast
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        type="text"
                        value={updatedMenu[index].lunch}
                        onChange={(e) =>
                          handleInputChange(index, "lunch", e.target.value)
                        }
                      />
                    ) : (
                      item.lunch
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        type="text"
                        value={updatedMenu[index].dinner}
                        onChange={(e) =>
                          handleInputChange(index, "dinner", e.target.value)
                        }
                      />
                    ) : (
                      item.dinner
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="update-btn"
            onClick={editMode ? handleSave : handleUpdate}
          >
            {editMode ? "OK" : "Update"}
          </button>
        </div>
      </div>

      {/* Overlay Box */}
      {showConfirmation && (
        <div className="overlay">
          <div className="overlay-box">
            <p>Menu has been submitted for approval!</p>
            <button
              className="close-btn"
              onClick={() => {
                setShowConfirmation(false);
                window.location.reload();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessSupervisorMenuPage;

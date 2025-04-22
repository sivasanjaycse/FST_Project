import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./adminNavbar";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    usrid: "",
    user: "",
    password: "",
    role: "student",
    mess: "Veg Mess",
  });

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:5000/users", newUser);
      setNewUser({
        usrid: "",
        user: "",
        password: "",
        role: "student",
        mess: "Veg Mess",
      });
      fetchUsers();
    } catch (err) {
      alert("Error adding user: " + err.response.data.error);
    }
  };

  const handleDelete = async (u) => {
    if (u.role != "admin") {
      await axios.delete(`http://localhost:5000/users/${u.usrid}`);
      fetchUsers();
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="supervisor-grocery-page">
        <div className="grocery-container">
          <h2 className="section-title">User Management</h2>
          <table className="grocery-table">
            <thead>
              <tr>
                <th>UsrID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Role</th>
                <th>Mess</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.usrid}>
                  <td>{u.usrid}</td>
                  <td>{u.user}</td>
                  <td>{u.password}</td>
                  <td>{u.role}</td>
                  <td>{u.mess}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleDelete(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Add New User</h3>
          <input
            type="number"
            placeholder="UsrID"
            value={newUser.usrid}
            onChange={(e) =>
              setNewUser({ ...newUser, usrid: parseInt(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Username"
            value={newUser.user}
            onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
          />
          <input
            type="text"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="student">student</option>
            <option value="supervisor">supervisor</option>
          </select>
          <select
            value={newUser.mess}
            onChange={(e) => setNewUser({ ...newUser, mess: e.target.value })}
          >
            <option value="Veg Mess">Veg Mess</option>
            <option value="PG Mess">PG Mess</option>
            <option value="NV Mess">NV Mess</option>
          </select>
          <button className="add-btn" onClick={handleAddUser}>
            Add User
          </button>
        </div>
      </div>
    </>
  );
};

export default UserManagement;

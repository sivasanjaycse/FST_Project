import React from "react";
import { NavLink } from "react-router-dom";
// import "../Styles/Navbar.css"; // Import the CSS

const AdminNavbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/Mess Admin Dashboard" className="nav-item">
        Dashboard
      </NavLink>
      <NavLink to="/Mess Admin Announcements" className="nav-item">
        Announcements
      </NavLink>
      <NavLink to="/Mess Admin WM" className="nav-item">
        Waste Management
      </NavLink>
      <NavLink to="/Mess Admin Groceries" className="nav-item">
        Groceries
      </NavLink>
      <NavLink to="/Mess Admin Quality" className="nav-item">
        Quality Management
      </NavLink>
      <NavLink to="/Mess Supervisor Help" className="nav-item">
        Help
      </NavLink>
      <NavLink to="/" className="nav-item">
        Logout
      </NavLink>
    </nav>
  );
};

export default AdminNavbar;

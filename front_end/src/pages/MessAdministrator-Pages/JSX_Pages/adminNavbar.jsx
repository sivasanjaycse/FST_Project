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
      <NavLink to="/Mess Supervisor Menu" className="nav-item">
        Mess Menu
      </NavLink>
      <NavLink to="/Mess Supervisor Feedback" className="nav-item">
        Feedbacks
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

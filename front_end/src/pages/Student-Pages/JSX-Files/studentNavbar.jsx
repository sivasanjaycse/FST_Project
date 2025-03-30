import React from "react";
import { NavLink } from "react-router-dom";

const StudentNavbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/student-dashboard" className="nav-item">
        Dashboard
      </NavLink>
      <NavLink to="/Student Announcements" className="nav-item">
        Announcements
      </NavLink>
      <NavLink to="/Student Menu" className="nav-item">
      Mess Menu
      </NavLink>
      <NavLink to="/" className="nav-item">
      Mess Bill
      </NavLink>
      <NavLink to="/" className="nav-item">
      Feedback
      </NavLink>
      <NavLink to="/" className="nav-item">
      Feature
      </NavLink>
      <NavLink to="/" className="nav-item">
        Logout
      </NavLink>
    </nav>
  );
};

export default StudentNavbar;

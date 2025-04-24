import React from "react";
import { NavLink, useParams } from "react-router-dom";

const StudentNavbar = () => {
  const { messName } = useParams();
  return (
    <nav className="navbar">
      <NavLink to={"/student-dashboard/"+messName} className="nav-item">
        Dashboard
      </NavLink>
      <NavLink to={"/Student Announcements/"+messName} className="nav-item">
        Announcements
      </NavLink>
      <NavLink to={"/Student Menu/"+messName} className="nav-item">
        Mess Menu
      </NavLink>
      <NavLink to={"/Student Mess Change/"+messName} className="nav-item">
        Change Preference
      </NavLink>
      <NavLink to="/" className="nav-item">
        Feedback
      </NavLink>
      <NavLink to="/" className="nav-item">
        Logout
      </NavLink>
    </nav>
  );
};

export default StudentNavbar;

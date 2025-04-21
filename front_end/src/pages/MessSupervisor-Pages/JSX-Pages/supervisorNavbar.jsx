import React from "react";
import { NavLink, useParams } from "react-router-dom";
import "../Styles/Navbar.css"; // Import the CSS
const SupervisorNavbar = () => {
  const { messName } = useParams();
  return (
    <nav className="navbar">
      <NavLink
        to={"/Mess Supervisor Dashboard/" + messName}
        className="nav-item"
      >
        Dashboard
      </NavLink>
      <NavLink
        to={"/Mess Supervisor DailyLog/" + messName}
        className="nav-item"
      >
        Daily Log
      </NavLink>
      <NavLink
        to={"/Mess Supervisor Groceries/" + messName}
        className="nav-item"
      >
        Groceries
      </NavLink>
      <NavLink to={"/Mess Supervisor Menu/" + messName} className="nav-item">
        Mess Menu
      </NavLink>
      <NavLink
        to={"/Mess Supervisor Feedback/" + messName}
        className="nav-item"
      >
        Feedbacks
      </NavLink>
      <NavLink to={"/Mess Supervisor Help/" + messName} className="nav-item">
        Help
      </NavLink>
      <NavLink to="/" className="nav-item">
        Logout
      </NavLink>
    </nav>
  );
};

export default SupervisorNavbar;

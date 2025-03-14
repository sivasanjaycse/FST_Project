import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Styles/Navbar.css'; // Import the CSS

const SupervisorNavbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/Mess Supervisor Dashboard" className="nav-item">Dashboard</NavLink>
      <NavLink to="/Mess Supervisor DailyLog" className="nav-item">Daily Log</NavLink>
      <NavLink to="/groceries" className="nav-item">Groceries</NavLink>
      <NavLink to="/mess-menu" className="nav-item">Mess Menu</NavLink>
      <NavLink to="/feedbacks" className="nav-item">Feedbacks</NavLink>
      <NavLink to="/feedbacks" className="nav-item">Help</NavLink>
      <NavLink to="/" className="nav-item">Logout</NavLink>
    </nav>
  );
};

export default SupervisorNavbar;

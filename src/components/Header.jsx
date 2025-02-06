import React from 'react';
import './Header.css'; // Importing the styles for the header

const Header = () => {
  return (
    <header className="header">
      <h1 className="title">DigitalMess</h1>
      <nav>
        <ul className="nav-links">
          <li><a href="/about" className="nav-link">About</a></li>
          <li><a href="/services" className="nav-link">Services</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

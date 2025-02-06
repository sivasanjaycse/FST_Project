// src/pages/IntroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importing Link from React Router
import './IntroPage.css'; // Importing styles for the intro page

const IntroPage = () => {
  return (
    <div className="intro-page">
      <div className="intro-content">
        <h1>Welcome to DigitalMess</h1>
        <p>
          DigitalMess is a comprehensive platform designed to manage and streamline various aspects of business operations. This website provides detailed information regarding inventories, allowing users to track, update, and manage stock levels efficiently. Additionally, it offers a space for users to provide valuable feedback, ensuring continuous improvement and customer satisfaction. In case of any issues or concerns, users can easily raise complaints through the platform, enabling swift resolutions and maintaining high-quality service. Whether you're managing inventory or addressing customer concerns, DigitalMess serves as a central hub for efficient and transparent operations.
        </p>
        
        <div className="login-buttons">
          <Link to="/student-login">
            <button className="login-btn">Student &#x1F468;&#x200D;&#x1F393;
            </button>
          </Link>
          <Link to ="/Mess Supervisor login"> 
          <button className="login-btn">Mess Supervisor &#x1F477;&#x200D;&#x2642;
            
          </button>
          </Link>
          <Link to="/Staff Login">
          <button className="login-btn">Staff Login &#x1F468;&#x200D;&#x1F4BC;
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;

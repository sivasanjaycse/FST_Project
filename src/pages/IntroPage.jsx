// src/pages/IntroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importing Link from React Router
import './IntroPage.css'; // Importing styles for the intro page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie,faUsers} from '@fortawesome/free-solid-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent Font Awesome from dynamically adding its CSS
config.autoAddCss = false;

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
            <button className="login-btn">
              <FontAwesomeIcon icon={faUserGraduate} className="icon" /> Student
            </button>
          </Link>
          <Link to="/Mess Supervisor login"> 
            <button className="login-btn">
            <FontAwesomeIcon icon={faUsers} className="icon" /> Mess Supervisor
            </button>
          </Link>
          <Link to="/Mess Administrator Login">
            <button className="login-btn">
            <FontAwesomeIcon icon={faUserTie} className="icon" /> Mess Administrator
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;

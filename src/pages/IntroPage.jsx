// src/pages/IntroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importing Link from React Router
import './IntroPage.css'; // Importing styles for the intro page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie,faUser} from '@fortawesome/free-solid-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent Font Awesome from dynamically adding its CSS
config.autoAddCss = false;

const IntroPage = () => {
  return (
    <div className="intro-page">
      <div className="intro-content">
        <h1>Welcome to Digital Mess</h1>
        <p>
Welcome to the future of mess management! Our Digital Mess combines the cutting-edge technology with streamlined processes, ensuring greater efficiency, transparency, and engagement across the entire mess operation. By leveraging data-driven insights and real-time feedback, we create a seamless and responsive environment where all aspects of mess management work in harmony. From improving resource utilization to enhancing communication, this system is designed to bring tangible improvements, making operations smoother and more effective for everyone involved. Embrace the change, and experience a smarter, more efficient approach to mess management. 
        </p>
        <div className="login-buttons">
          <Link to="/student-login">
            <button className="login-btn">
              <FontAwesomeIcon icon={faUserGraduate} className="icon" /> Student
            </button>
          </Link>
          <Link to="/Mess Supervisor login"> 
            <button className="login-btn">
            <FontAwesomeIcon icon={faUser} className="icon" /> Mess Supervisor
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

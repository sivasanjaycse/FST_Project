// src/pages/StudentLoginPage.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock} from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css'; // Importing the styles for the login page

const MessSupervisorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (username === '' || password === '') {
      setError('Please fill in both fields.');
      return;
    }

    // You can replace this with actual login logic
    window.location.href = '/Mess Supervisor Dashboard'
    console.log('MessSupervisor Logged in:', { username, password });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2><FontAwesomeIcon icon={faUser} className="icon" /> Mess Supervisor Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username"><FontAwesomeIcon icon={faUser} className="icon" /> Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password"><FontAwesomeIcon icon={faLock} className="icon" /> Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default MessSupervisorLogin;

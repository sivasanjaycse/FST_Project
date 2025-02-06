// src/pages/StudentLoginPage.jsx
import React, { useState } from 'react';
import './StudentLoginPage.css'; // Importing the styles for the login page

const StudentLoginPage = () => {
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
    if (username === 'sample' || password === 'sample') 
    {
    
    return;
    }
    };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Student Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
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

export default StudentLoginPage;

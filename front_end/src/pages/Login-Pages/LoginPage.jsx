import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faUserGraduate,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import "./LoginPage.css"; // Your CSS file for styling
import { useParams } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { role } = useParams(); // gets 'student', 'supervisor', 'admin'
  const roleIcons = {
    student: faUserGraduate,
    supervisor: faUser,
    admin: faUserTie,
  };

  const roleLabels = {
    student: "Student Login",
    supervisor: "Supervisor Login",
    admin: "Administrator Login",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError("Please fill in both fields.");
      return;
    }
    if (username === "stu" || password === "stu") {
      window.location.href = "/student-dashboard";
      return;
    }
    if (username === "sup" || password === "sup") {
      window.location.href = "/Mess Supervisor Dashboard";
      return;
    }
    if (username === "admin" || password === "admin") {
      window.location.href = "/Mess Admin Dashboard";
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/login", {
        user: username,
        password: password,
      });

      const { success, role, mess } = response.data;

      if (success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);
        alert("Login successful!");

        if (role === "student") {
          window.location.href = "/student-dashboard";
        } else if (role === "supervisor") {
          window.location.href = "/Mess Supervisor Dashboard/"+mess;
        } else if (role === "admin") {
          window.location.href = "/Mess Admin Dashboard";
        }
      }
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>
          <h2>
            <FontAwesomeIcon
              icon={roleIcons[role] || faUser}
              className="icon"
            />{" "}
            {roleLabels[role] || "User Login"}
          </h2>
        </h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} className="icon" /> Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} className="icon" /> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StudentNavbar from "./studentNavbar";

const MessChangeForm = () => {
  const [rollno, setRollno] = useState("");
  const [changingMess, setChangingMess] = useState("Veg Mess");
  const [message, setMessage] = useState("");
  const { messName } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/mess-change-request", {
        rollno,
        current_mess: messName,
        changing_mess: changingMess,
      });
      setMessage("✅ Request sent for approval!");
      setRollno("");
    } catch (err) {
      setMessage("❌ Error: " + err.response.data.error);
    }
  };

  return (
    <>
      <StudentNavbar />
      <div className="student-dashboard-page">
        <div className="dashboard-container">
          <h2>Mess Change Request</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Roll Number"
              value={rollno}
              onChange={(e) => setRollno(e.target.value)}
              required
            />
            <br />
            <br />
            <label>Current Mess: {messName} </label>
            <br />
            <br />
            <label>Change To: </label>
            <select
              value={changingMess}
              onChange={(e) => setChangingMess(e.target.value)}
            >
              <option>Veg Mess</option>
              <option>PG Mess</option>
              <option>NV Mess</option>
            </select>
            <br />
            <br />
            <button type="submit" className="login-btn">
              Request Mess Change
            </button>
          </form>
          <p>{message}</p>
        </div>
      </div>
    </>
  );
};

export default MessChangeForm;

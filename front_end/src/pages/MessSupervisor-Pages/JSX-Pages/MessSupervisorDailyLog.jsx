import React, { useState, useEffect } from "react";
import axios from "axios";
import SupervisorNavbar from "./supervisorNavbar";
import "../Styles/dailylog.css";
import { useParams } from "react-router-dom";

const MessSupervisorDailyLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentCount, setNewStudentCount] = useState("");
  const { messName } = useParams();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSession, setSelectedSession] = useState("breakfast"); // Default session

  // Fetch logs from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/daily-logs/" + messName)
      .then((response) => setLogs(response.data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  // Check for duplicate entries
  const handleSubmitLog = () => {
    if (!newStudentCount || !selectedSession) {
      alert("Please enter a valid student count and session.");
      return;
    }

    // Check if the log for the same date and session already exists
    const isDuplicate = logs.some(
      (log) => log.date === selectedDate && log.session === selectedSession
    );

    if (isDuplicate) {
      alert("Duplicate entry! Log for this session already exists.");
      return;
    }

    // Proceed with submitting data if no duplicate
    axios
      .post("http://localhost:5000/daily-logs/" + messName, {
        date: selectedDate,
        session: selectedSession,
        studentCount: parseInt(newStudentCount, 10),
      })
      .then((response) => {
        setLogs(response.data.logs);
        setIsModalOpen(false);
        setNewStudentCount("");
        setSelectedSession("");
      })
      .catch((error) => console.error("Error adding log:", error));
    window.location.reload();
  };

  return (
    <>
      <SupervisorNavbar />
      <div className="daily-log-page">
        <div className="daily-log-container">
          {/* Section 1: Log Student Count */}
          <section className="log-section">
            <h2 className="section-title">Enter Today's Student Count</h2>
            <button className="log-btn" onClick={() => setIsModalOpen(true)}>
              Enter Daily Log
            </button>
          </section>

          <hr />

          {/* Section 2: Display Previously Logged Data */}
          <section className="log-history">
            <h2 className="section-title">Previous Logs</h2>
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Session</th>
                  <th>Number of Students</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.date}</td>
                      <td>{log.session}</td>
                      <td>{log.studentCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No logs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/* Modal for adding new log */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter the Number of Students</h3>
            <select
              className="modal-input"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
            <input
              type="number"
              className="modal-input"
              placeholder="Enter count"
              value={newStudentCount}
              onChange={(e) => setNewStudentCount(e.target.value)}
            />
            <div className="modal-actions">
              <button className="submit-btn" onClick={handleSubmitLog}>
                Submit
              </button>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessSupervisorDailyLogPage;

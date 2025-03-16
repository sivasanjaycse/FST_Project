import React, { useState, useEffect } from "react";
import axios from "axios";
import SupervisorNavbar from "./supervisorNavbar";
import "../Styles/dailylog.css";

const MessSupervisorDailyLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentCount, setNewStudentCount] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch logs from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/daily-logs")
      .then((response) => setLogs(response.data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  // Handle log submission
  const handleSubmitLog = () => {
    if (!newStudentCount) {
      alert("Please enter a valid student count.");
      return;
    }

    axios
      .post("http://localhost:5000/daily-logs", {
        date: selectedDate,
        studentCount: parseInt(newStudentCount, 10),
      })
      .then((response) => {
        setLogs(response.data.logs);
        setIsModalOpen(false);
        setNewStudentCount("");
      })
      .catch((error) => console.error("Error adding log:", error));
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
                  <th>Number of Students</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.date}</td>
                      <td>{log.studentCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No logs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <hr />

          {/* Section 3: Download Waste Management PDF */}
          <section className="waste-management">
            <h2 className="section-title">Download Waste Management Report</h2>
            <input type="date" className="date-picker" />
            <button className="download-btn">Download PDF</button>
          </section>
        </div>
      </div>

      {/* Modal for adding new log */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter the Number of Students</h3>
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

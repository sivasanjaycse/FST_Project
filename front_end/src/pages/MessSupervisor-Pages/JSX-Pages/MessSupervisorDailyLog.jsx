import React, { useState } from "react";
import SupervisorNavbar from "./supervisorNavbar";
import "../Styles/dailylog.css";

const MessSupervisorDailyLogPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SupervisorNavbar onTabChange={(tabIndex) => console.log("Active Tab:", tabIndex)} />
      <div className="daily-log-page">
        <div className="daily-log-container">
          
          {/* Section 1: Log Student Count */}
          <section className="log-section">
            <h2 className="section-title">Enter Today's Student Count</h2>
            <button className="log-btn" onClick={() => setIsModalOpen(true)}>Enter Daily Log</button>
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
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>
                <tr>
                <td>11-08-2005</td>
                <td>1222</td>
                </tr>

                {/* Data will be dynamically mapped here */}
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

      {/* Modal (conditionally rendered) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter the Number of Students</h3>
            <input type="number" className="modal-input" placeholder="Enter count" />
            <div className="modal-actions">
              <button className="submit-btn" onClick={() => setIsModalOpen(false)}>Submit</button>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessSupervisorDailyLogPage;

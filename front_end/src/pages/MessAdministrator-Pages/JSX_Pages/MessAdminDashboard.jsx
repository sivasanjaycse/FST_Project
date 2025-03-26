import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./adminNavbar";
import "../Styles/adashboard.css";
const MessAdminDashboardPage = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/pending-approvals"
      );
      setPendingApprovals(response.data);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
    }
  };

  const handleApprove = async (rollno) => {
    try {
      await axios.post("http://localhost:5000/approve-request", { rollno });
      setPendingApprovals((prev) =>
        prev.filter((student) => student.rollno !== rollno)
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  return (
    <>
      <AdminNavbar
        onTabChange={(tabIndex) => console.log("Active Tab:", tabIndex)}
      />
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-content-container">
          <h2 className="approval-title">Pending Mess Preference Approvals</h2>
          {pendingApprovals.length === 0 ? (
            <p className="no-approvals">No pending approvals.</p>
          ) : (
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Current Mess</th>
                  <th>Changing To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((student) => (
                  <tr key={student.rollno}>
                    <td>{student.rollno}</td>
                    <td>{student.name}</td>
                    <td>{student.current_mess}</td>
                    <td>{student.changing_mess}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(student.rollno)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default MessAdminDashboardPage;

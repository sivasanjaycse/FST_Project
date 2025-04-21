import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./adminNavbar";
import "../Styles/adashboard.css";

const MessAdminDashboardPage = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [pendingMenu, setPendingMenu] = useState(null);
  const [showMenuModal, setShowMenuModal] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
    fetchPendingMenuUpdates();
  }, []);
  
  const fetchPendingMenuUpdates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pending-menu-updates");
      setPendingMenu(response.data.length > 0 ? response.data : null); // Only set if data exists
    } catch (error) {
      console.error("Error fetching pending menu updates:", error);
    }
  };
  
  

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pending-approvals");
      setPendingApprovals(response.data);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
    }
  };

  const handleApprove = async (rollno) => {
    try {
      await axios.post("http://localhost:5000/approve-request", { rollno });
      setPendingApprovals((prev) => prev.filter((student) => student.rollno !== rollno));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleApproveMenu = async () => {
    try {
      const response = await axios.post("http://localhost:5000/approve-menu-update");
      alert(response.data.message);
      setPendingMenu(null); // Remove pending updates from UI
      setShowMenuModal(false); // Close modal
    } catch (error) {
      console.error("Error approving menu update:", error);
    }
  };

  return (
    <>
      <AdminNavbar onTabChange={(tabIndex) => console.log("Active Tab:", tabIndex)} />
      <div className="admin-dashboard-page">
        {/* Pending Mess Preference Approvals */}
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
                      <button className="approve-btn" onClick={() => handleApprove(student.rollno)}>
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pending Menu Approvals Notification */}
        {pendingMenu && (
          <div className="admin-dashboard-content-container">
            <h2 className="approval-title">Pending Mess Preference Approvals</h2>
            <button className="view-menu-btn" onClick={() => setShowMenuModal(true)}>
              Click Here to view
            </button>
          </div>
        )}

        {/* Menu Approval Modal */}
        {showMenuModal && pendingMenu && (
          <div className="menu-modal">
            <div className="menu-modal-content">
              <h2>Pending Menu Update {pendingMenu.mess}</h2>
              <table className="menu-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(pendingMenu).map(([day, meals]) => (
                    <tr key={day}>
                      <td>{day}</td>
                      <td>{meals.breakfast}</td>
                      <td>{meals.lunch}</td>
                      <td>{meals.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="approve-btn" onClick={handleApproveMenu}>
                Approve Menu
              </button>
              <button className="close-btn" onClick={() => setShowMenuModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessAdminDashboardPage;

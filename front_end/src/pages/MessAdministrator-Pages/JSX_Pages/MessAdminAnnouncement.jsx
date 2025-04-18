import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/announcements.css"; // Import CSS
import AdminNavbar from "./adminNavbar";

const MessAdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [viewer, setViewer] = useState("students");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) return; // Avoid empty announcements

    const announcementData = { announcement: newAnnouncement, viewer };

    try {
      await axios.post(
        "http://localhost:5000/add-announcement",
        announcementData
      );
      setAnnouncements([...announcements, announcementData]);
      setShowModal(false);
      setNewAnnouncement("");
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (index) => {
    const announcementToDelete = announcements[index].announcement;

    try {
      await axios.post("http://localhost:5000/delete-announcement", {
        announcement: announcementToDelete,
      });

      setAnnouncements(announcements.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-announcements-page">
        <div className="admin-announcements-container">
          <h2 className="section-title">MESS ANNOUNCEMENTS</h2>
          {announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            <ul className="announcements-list">
              {announcements.map((item, index) => (
                <li key={index} className="announcement-item">
                  <span>
                    {item.announcement} ({item.viewer})
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteAnnouncement(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add Announcement
          </button>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Announcement</h3>
              <textarea
                placeholder="Enter announcement..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
              ></textarea>
              <select
                value={viewer}
                onChange={(e) => setViewer(e.target.value)}
              >
                <option value="students">Students</option>
                <option value="supervisors">Supervisors</option>
                <option value="everyone">Everyone</option>
              </select>
              <div className="modal-buttons">
                <button onClick={handleAddAnnouncement}>Submit</button>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessAdminAnnouncementsPage;

import "../Styles/dashboard.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SupervisorNavbar from "./supervisorNavbar";

const MessSupervisorDashboardPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const {messName} = useParams();
  useEffect(() => {
    axios
      .get("http://localhost:5000/announcements")
      .then((response) => {
        // Filter announcements for Supervisor or Everyone
        const filteredAnnouncements = response.data.filter(
          (announcement) =>
            announcement.viewer === "supervisors" ||
            announcement.viewer === "everyone"
        );
        setAnnouncements(filteredAnnouncements);
      })
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  return (
    <>
      <SupervisorNavbar
        onTabChange={(tabIndex) => console.log("Active Tab:", tabIndex)}
      />
      <div className="supervisor-dashboard-page">
        <div className="supervisor-announcement-container">
          <h1>Announcements</h1>
          <article className="supervisor-announcement-list">
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <section key={index}>{announcement.announcement}</section>
              ))
            ) : (
              <section>No announcements available.</section>
            )}
          </article>
        </div>
      </div>
    </>
  );
};
export default MessSupervisorDashboardPage;

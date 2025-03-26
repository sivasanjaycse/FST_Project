import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/announcements")
      .then((response) => {
        // Filter announcements for Supervisor or Everyone
        const filteredAnnouncements = response.data.filter(
          (announcement) =>
            announcement.viewer === "students" || announcement.viewer === "everyone"
        );
        setAnnouncements(filteredAnnouncements);
      })
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  return (
    <>
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
export default StudentAnnouncementsPage;

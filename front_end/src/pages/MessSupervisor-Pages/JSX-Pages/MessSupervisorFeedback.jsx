import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/feedback.css";
import SupervisorNavbar from "./supervisorNavbar";

const RatingCircle = ({ title, rating, delay }) => {
  const numericRating = parseFloat(rating);
  const safeRating = !isNaN(numericRating) ? numericRating.toFixed(1) : "N/A";

  return (
    <div className="rating-container" style={{ animationDelay: `${delay}s` }}>
      <h3 className="rating-title">{title}</h3>
      <svg
        className="rating-circle"
        width="80"
        height="80"
        viewBox="0 0 100 100"
      >
        <circle className="circle-bg" cx="50" cy="50" r="40"></circle>
        <circle
          className="circle-progress"
          cx="50"
          cy="50"
          r="40"
          style={{
            strokeDashoffset: !isNaN(numericRating)
              ? 251 - (numericRating / 5) * 251
              : 251,
          }}
        ></circle>
      </svg>
      <p className="rating-text"> {safeRating}/5</p>
    </div>
  );
};

const MessSupervisorFeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSession, setSelectedSession] = useState("Breakfast");

  const fetchFeedback = () => {
    axios
      .get(
        `http://localhost:5000/feedback?date=${selectedDate}&session=${selectedSession}`
      )
      .then((response) => setFeedbackData(response.data))
      .catch((error) => console.error("Error fetching feedback:", error));
  };

  useEffect(() => {
    fetchFeedback();
  }, [selectedDate, selectedSession]); // Fetch data when date or session changes

  return (
    <>
      <SupervisorNavbar />
      <div className="supervisor-feedback-page">
        <div className="feedback-container">
          <h2 className="supervisor-feedback-title">Daily Food Feedback</h2>

          {/* Date & Session Picker */}
          <div className="filters">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="session-picker"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          {feedbackData ? (
            <>
              <div className="ratings">
                <RatingCircle
                  title="Main Dish"
                  rating={feedbackData.averageMainDish}
                  delay={0.5}
                />
                <RatingCircle
                  title="Side Dish"
                  rating={feedbackData.averageSideDish}
                  delay={1}
                />
                <RatingCircle
                  title="Overall"
                  rating={feedbackData.averageOverall}
                  delay={1.5}
                />
              </div>

              <div className="reviews">
                <div className="worst-review">
                  <h3>Bad Review</h3>
                  <p>{feedbackData.worstReview}</p>
                </div>

                <div className="best-review">
                  <h3>Good Review</h3>
                  <p>{feedbackData.bestReview}</p>
                </div>
              </div>
            </>
          ) : (
            <p>Loading feedback...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MessSupervisorFeedbackPage;

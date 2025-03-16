import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/feedback.css";
import SupervisorNavbar from "./supervisorNavbar";

const RatingCircle = ({ title, rating, delay }) => {
  // Ensure rating is a valid number, else default to 0
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

  useEffect(() => {
    axios
      .get(`http://localhost:5000/feedback?date=${selectedDate}`)
      .then((response) => setFeedbackData(response.data))
      .catch((error) => console.error("Error fetching feedback:", error));
  }, [selectedDate]);

  return (
    <>
      <SupervisorNavbar />
      <div className="supervisor-feedback-page">
        <div className="feedback-container">
          <h2 className="supervisor-feedback-title">Daily Food Feedback</h2>

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />

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
                <div className="best-review">
                  <h3>Good Review</h3>
                  <p>{feedbackData.bestReview}</p>
                </div>

                <div className="worst-review">
                  <h3>Bad Review</h3>
                  <p>{feedbackData.worstReview}</p>
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

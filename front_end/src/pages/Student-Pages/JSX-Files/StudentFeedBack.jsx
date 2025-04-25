import React, { useState } from "react";
import axios from "axios";
import StudentNavbar from "./studentNavbar";

const StudentFeedback = () => {
  const [form, setForm] = useState({
    session: "Breakfast",
    main_dish_rating: 3,
    side_dish_rating: 3,
    overall_rating: 3,
    review: "",
    mess: "Veg Mess",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/submit-feedback", {
        ...form,
        date: today,
      });
      alert("Thanks for your feedback! ");
      setForm({
        session: "Breakfast",
        main_dish_rating: 3,
        side_dish_rating: 3,
        overall_rating: 3,
        review: "",
        mess: "Veg Mess",
      });
    } catch (err) {
      alert("Error submitting feedback");
      console.error(err);
    }
  };

  return (
    <>
      <StudentNavbar />
      <div className="supervisor-feedback-page">
        <div className="feedback-container" id="stu-feedback-container">
          <h2>Student Feedback</h2>
          <form onSubmit={handleSubmit}>
            <label>Session:</label>
            <br />
            <select name="session" value={form.session} onChange={handleChange}>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Snacks</option>
              <option>Dinner</option>
            </select>
            <br />

            <label>Mess:</label>
            <br />
            <select name="mess" value={form.mess} onChange={handleChange}>
              <option>Veg Mess</option>
              <option>NV Mess</option>
              <option>PG Mess</option>
            </select>
            <br />

            <label>Main Dish Rating (1-5):</label>
            <br />
            <input
              type="number"
              name="main_dish_rating"
              value={form.main_dish_rating}
              min={1}
              max={5}
              onChange={handleChange}
            />
            <br />

            <label>Side Dish Rating (1-5):</label>
            <br />
            <input
              type="number"
              name="side_dish_rating"
              value={form.side_dish_rating}
              min={1}
              max={5}
              onChange={handleChange}
            />
            <br />

            <label>Overall Rating (1-5):</label>
            <br />
            <input
              type="number"
              name="overall_rating"
              value={form.overall_rating}
              min={1}
              max={5}
              onChange={handleChange}
            />
            <br />

            <label>Review (Optional):</label>
            <br />
            <textarea
              name="review"
              value={form.review}
              onChange={handleChange}
            />
            <br />

            <button type="submit" className="login-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentFeedback;

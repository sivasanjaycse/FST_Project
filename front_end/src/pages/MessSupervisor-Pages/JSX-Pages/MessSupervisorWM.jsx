import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import AdminNavbar from "./supervisorNavbar";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SupWasteManagementPage = () => {
  const [wasteData, setWasteData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [messType, setMessType] = useState("PG Mess"); // default
  const sessions = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const { messName } = useParams;
  const fetchWasteScores = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const sessionData = [];

    for (const session of sessions) {
      try {
        const response = await axios.get(`http://localhost:5000/waste-score`, {
          params: { date: formattedDate, session, messType: messName },
        });
        sessionData.push(response.data);
      } catch (error) {
        console.error(`Error fetching waste score for ${session}:`, error);
      }
    }
    setWasteData(sessionData);
  };

  useEffect(() => {
    fetchWasteScores(selectedDate);
  }, [selectedDate, messType]);

  return (
    <>
      <AdminNavbar />
      <div className="WM-page">
        <div className="WM-container">
          <div className="waste-management-container">
            <h2 className="section-title">WASTE MANAGEMENT ANALYSIS</h2>

            {/* Date Picker */}
            <div className="date-picker-container">
              <label>Select Date:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </div>

            {wasteData.length > 0 ? (
              <>
                <div className="session-details">
                  {wasteData.map((data, index) => (
                    <div key={index} className="session-card">
                      <h3>{data.session}</h3>
                      <p>
                        <strong>Overall Rating:</strong>{" "}
                        {data.overallRating !== null
                          ? data.overallRating
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Student Count:</strong>{" "}
                        {data.studentCount !== null ? data.studentCount : "N/A"}
                      </p>
                      <p>
                        <strong>Total Cost:</strong>{" "}
                        {data.totalCost !== null ? `₹${data.totalCost}` : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={wasteData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="session" type="category" width={100} />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                      }}
                      labelStyle={{
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    />

                    <Legend />
                    <Bar dataKey="wasteScore" fill="#4CAF50" barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <p>Loading data...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupWasteManagementPage;

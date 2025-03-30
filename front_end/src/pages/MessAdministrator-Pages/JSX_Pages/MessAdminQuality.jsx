import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./adminNavbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../Styles/qualityManagement.css"; // Add styles

const MessAdminQualityPage = () => {
  const [qualityData, setQualityData] = useState([]);
  const today = new Date().toISOString().split("T")[0]; // Get current date

  useEffect(() => {
    const fetchQualityScores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/quality-score",
          { params: { date: today } }
        );

        // Ensure data formatting
        const formattedData = response.data.map((entry) => ({
          date: entry.date,
          session: entry.session,
          xLabel: `${entry.date} (${entry.session})`, // Combine Date & Session
          qualityScore: parseFloat(entry.qualityScore),
        }));

        setQualityData(formattedData);
      } catch (error) {
        console.error("Error fetching quality scores:", error);
      }
    };

    fetchQualityScores();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="quality-management-page">
        <div className="quality-management-container">
          <h2>Quality Management Analysis (Past 4 Days)</h2>

          {qualityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <LineChart
                data={qualityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <XAxis
                  dataKey="xLabel"
                  type="category"
                  angle={-15} // Slight tilt for better visibility
                  textAnchor="end"
                  interval={0} // Show all labels
                  tick={{ fontSize: 12 }} // Adjust font size
                  height={80} // Ensure enough space
                />
                <YAxis domain={[0, 100]} />
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
                <Line
                  type="monotone"
                  dataKey="qualityScore"
                  stroke="#4CAF50"
                  strokeWidth={4}
                  dot={{ r: 4 }} // Small dots on data points
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MessAdminQualityPage;

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const db = require;
const connectToDatabase = require("./dbconnect");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const groceriesFilePath = "./groceries.json";
const menuFilePath = "./menu.json";
const feedbackFile = "./feedback.json";
const DATA_FILE = "dailyLogs.json";
const preferenceFilePath = "./student_preferences_update.json";
const menuApprovalFilePath = "./menu_pending_approval.json";
const ANNOUNCEMENTS_FILE = "./announcements.json";

// Read JSON file utility function
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write JSON file utility function
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

const readFeedback = () => {
  const data = fs.readFileSync(feedbackFile);
  return JSON.parse(data);
};

/************************SUPERVISOR FEATURES****************************************************************************** */
/************************MENU****************************************************************************************** */
// **1️⃣ Fetch Current Menu**
app.get("/menu", (req, res) => {
  const menuData = readJSONFile(menuFilePath);
  res.json(menuData);
});

// **2️⃣ Submit Menu Change Request (Stores in Pending Approval)**
app.post("/update-menu", (req, res) => {
  const newData = req.body;
  writeJSONFile(menuApprovalFilePath, newData);
  res.json({ message: "Menu update request submitted for approval." });
});

// **3️⃣ Fetch Pending Menu Changes**
app.get("/pending-menu-updates", (req, res) => {
  const pendingUpdates = readJSONFile(menuApprovalFilePath);
  res.json(pendingUpdates);
});

// **4️⃣ Approve Menu Update**
app.post("/approve-menu-update", (req, res) => {
  const approvedData = readJSONFile(menuApprovalFilePath);

  if (approvedData.length === 0) {
    return res.status(404).json({ message: "No pending menu updates." });
  }

  writeJSONFile(menuFilePath, approvedData); // Update the main menu file
  writeJSONFile(menuApprovalFilePath, []); // Clear pending approvals

  res.json({ message: "Menu update approved and applied successfully." });
});

/************************FEEDBACK*************************************************************************************/

app.get("/feedback", (req, res) => {
  const { date, session } = req.query;
  const feedback = readFeedback().filter(
    (item) => item.date === date && item.session === session
  );

  if (feedback.length === 0) {
    return res.status(200).json({ message: "No feedback available" });
  }

  const totalMainDish = feedback.reduce(
    (sum, item) => sum + item.main_dish_rating,
    0
  );
  const totalSideDish = feedback.reduce(
    (sum, item) => sum + item.side_dish_rating,
    0
  );
  const totalOverall = feedback.reduce(
    (sum, item) => sum + item.overall_rating,
    0
  );

  const averageMainDish = (totalMainDish / feedback.length).toFixed(2);
  const averageSideDish = (totalSideDish / feedback.length).toFixed(2);
  const averageOverall = (totalOverall / feedback.length).toFixed(2);

  const bestReview = feedback.reduce((a, b) =>
    a.review.length > b.review.length ? a : b
  );
  const worstReview = feedback.reduce((a, b) =>
    a.review.length < b.review.length ? a : b
  );

  res.json({
    averageMainDish,
    averageSideDish,
    averageOverall,
    bestReview: bestReview.review,
    worstReview: worstReview.review,
  });
});

/************************DAILY LOGS****************************************************************************************/

// Read daily logs
app.get("/daily-logs", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });
    res.json(JSON.parse(data));
  });
});

// Add a new log entry
app.post("/daily-logs", (req, res) => {
  const { date, session, studentCount } = req.body;

  if (!date || !session || !studentCount) {
    return res
      .status(400)
      .json({ error: "Date, session, and student count required" });
  }

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    let logs = JSON.parse(data);
    logs.push({ date, session, studentCount });

    fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Error saving data" });
      res.json({ message: "Log added successfully", logs });
    });
  });
});

/*************************GROCERIES**************************************************************************************/
// Fetch groceries
app.get("/groceries", (req, res) => {
  res.json(readJSONFile(groceriesFilePath));
});

// Add new product
app.post("/groceries/add-product", (req, res) => {
  const groceries = readJSONFile(groceriesFilePath);
  const { name, quantity, price } = req.body;

  if (!name || isNaN(quantity) || isNaN(price)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const newProduct = {
    id: groceries.length + 1,
    name,
    quantity_kg_l: quantity,
    cost_per_unit: price,
    total_cost: quantity * price,
  };

  groceries.push(newProduct);
  writeJSONFile(groceriesFilePath, groceries);

  res.json({ message: "Product added successfully", product: newProduct });
});

// Remove product
app.delete("/groceries/:id", (req, res) => {
  const groceries = readJSONFile(groceriesFilePath);
  const productId = parseInt(req.params.id);
  const productIndex = groceries.findIndex((item) => item.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  const product = groceries[productIndex];
  groceries.splice(productIndex, 1);
  writeJSONFile(groceriesFilePath, groceries);
  return res.json({
    message: `Product "${product.name}" removed successfully`,
  });
});

// Update quantity (Add or Take)
app.post("/groceries/:type", (req, res) => {
  const groceries = readJSONFile(groceriesFilePath);
  const { id, quantity, price, session, date } = req.body;
  const product = groceries.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (req.params.type === "add") {
    const newTotalCost = product.total_cost + quantity * price;
    product.quantity_kg_l += quantity;
    product.cost_per_unit = newTotalCost / product.quantity_kg_l;
    product.total_cost = newTotalCost;
  } else if (req.params.type === "take") {
    if (product.quantity_kg_l < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.quantity_kg_l -= quantity;
    product.total_cost = (
      product.quantity_kg_l * product.cost_per_unit
    ).toFixed(2);

    // Update session usage
    let sessionUsage = readSessionUsage();
    const totalCost = (quantity * product.cost_per_unit).toFixed(2);

    // Check if an entry for the same date and session exists
    const existingEntry = sessionUsage.find(
      (entry) => entry.date === date && entry.session === session
    );

    if (existingEntry) {
      existingEntry.totalCost = (
        parseFloat(existingEntry.totalCost) + parseFloat(totalCost)
      ).toFixed(2);
    } else {
      sessionUsage.push({ date, session, totalCost });
    }

    writeSessionUsage(sessionUsage);
  }

  writeJSONFile(groceriesFilePath, groceries);
  res.json({ message: "Quantity updated", product });
});

const readSessionUsage = () => {
  try {
    const data = fs.readFileSync("session_usage.json", "utf8");
    return data ? JSON.parse(data) : []; // Return an empty array if data is empty
  } catch (error) {
    console.error(`Error reading session_usage.json:`, error);
    return []; // Return an empty array on error
  }
};

function writeSessionUsage(data) {
  fs.writeFileSync("session_usage.json", JSON.stringify(data, null, 2));
}

/***********************MESS ADMIN FEATURES**************************************************************************************/
/**************************DASHBOARD***************************************************************************** */

// **Fetch Pending Approvals**
app.get("/pending-approvals", (req, res) => {
  const data = readJSONFile(preferenceFilePath);
  const pendingApprovals = data.filter(
    (student) => student.status === "Approval Pending"
  );
  res.json(pendingApprovals);
});

// **Approve Student Request**
app.post("/approve-request", (req, res) => {
  const { rollno } = req.body;
  let data = readJSONFile(preferenceFilePath);

  const studentIndex = data.findIndex((student) => student.rollno === rollno);
  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  data[studentIndex].status = "Approved";
  writeJSONFile(preferenceFilePath, data);

  res.json({
    message: "Request approved successfully",
    student: data[studentIndex],
  });
});

/***********************Announcements Page ************************************************************************************************* */

// Fetch announcements
app.get("/announcements", (req, res) => {
  fs.readFile(ANNOUNCEMENTS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });
    res.json(JSON.parse(data));
  });
});

// Add announcement
app.post("/add-announcement", (req, res) => {
  const { announcement, viewer } = req.body;
  if (!announcement)
    return res.status(400).json({ error: "Empty announcement" });

  fs.readFile(ANNOUNCEMENTS_FILE, "utf8", (err, data) => {
    const announcements = err ? [] : JSON.parse(data);
    announcements.push({ announcement, viewer });

    fs.writeFile(
      ANNOUNCEMENTS_FILE,
      JSON.stringify(announcements, null, 2),
      (err) => {
        if (err)
          return res.status(500).json({ error: "Failed to save announcement" });
        res.json({ message: "Announcement added" });
      }
    );
  });
});

// Delete announcement
app.post("/delete-announcement", (req, res) => {
  const { index } = req.body;

  fs.readFile(ANNOUNCEMENTS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    let announcements = JSON.parse(data);
    announcements.splice(index, 1);

    fs.writeFile(
      ANNOUNCEMENTS_FILE,
      JSON.stringify(announcements, null, 2),
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Failed to delete announcement" });
        res.json({ message: "Announcement deleted" });
      }
    );
  });
});

/********************************Waste Management***********************************************************/
const calculateWasteScore = (date, session) => {
  const sessionData = readJSONFile("session_usage.json");
  const dailyLogs = readJSONFile("dailyLogs.json");
  const feedbackData = readJSONFile("feedback.json");

  let totalCost = null;
  let studentCount = null;
  let overallRating = null;

  // Extract total cost
  const costEntry = sessionData.find(
    (entry) =>
      entry.date === date &&
      entry.session.toLowerCase() === session.toLowerCase()
  );
  if (costEntry) totalCost = parseFloat(costEntry.totalCost);

  // Extract student count
  const countEntry = dailyLogs.find(
    (entry) =>
      entry.date === date &&
      entry.session.toLowerCase() === session.toLowerCase()
  );
  if (countEntry) studentCount = countEntry.studentCount;

  // Extract overall rating
  const matchingEntries = feedbackData.filter(
    (entry) =>
      entry.date === date &&
      entry.session.toLowerCase() === session.toLowerCase()
  );

  if (matchingEntries.length > 0) {
    const totalRating = matchingEntries.reduce(
      (sum, entry) => sum + entry.overall_rating,
      0
    );
    overallRating = totalRating / matchingEntries.length; // Average rating
  }

  // If data is missing, use averages
  if (totalCost === null) {
    const avgCost =
      sessionData.reduce((sum, entry) => sum + parseFloat(entry.totalCost), 0) /
      sessionData.length;
    totalCost = avgCost || 1500; // Default if no data
  }
  if (studentCount === null) {
    const avgCount =
      dailyLogs.reduce((sum, entry) => sum + entry.studentCount, 0) /
      dailyLogs.length;
    studentCount = avgCount || 80; // Default if no data
  }
  if (overallRating === null) {
    const avgRating =
      feedbackData.reduce((sum, entry) => sum + entry.overall_rating, 0) /
      feedbackData.length;

    overallRating = avgRating || 2.97; // Default if no data
  }
  // Calculate waste score
  const costPerStudent = totalCost / studentCount;
  const gotScore = costPerStudent / overallRating;
  const minScore = costPerStudent / 5;
  const maxScore = costPerStudent / 1.9;
  const wasteScore = (1 - (gotScore - minScore) / (maxScore - minScore)) * 100;

  return {
    date,
    session,
    wasteScore: wasteScore.toFixed(2), // Rounded value
    totalCost: totalCost.toFixed(2),
    studentCount: Math.floor(studentCount),
    overallRating: overallRating.toFixed(2),
  };
};

app.get("/waste-score", (req, res) => {
  const { date, session } = req.query;
  const result = calculateWasteScore(date, session);
  res.json(result);
});

/**************************************Quality Management*****************************************************/
const calculateQualityScore = (date, session) => {
  const wasteData = calculateWasteScore(date, session);
  if (!wasteData) return null;

  const { wasteScore, overallRating } = wasteData;
  const qualityScore = (parseFloat(wasteScore) + (overallRating * 100) / 5) / 2;

  return {
    date,
    session,
    qualityScore: qualityScore.toFixed(2),
  };
};

// API Endpoint to get Quality Scores for the past 4 days
app.get("/quality-score", (req, res) => {
  const { date } = req.query; // Get current date
  const sessions = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const pastDates = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(date);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  const results = [];

  pastDates.forEach((d) => {
    sessions.forEach((session) => {
      const result = calculateQualityScore(d, session);
      if (result) results.push(result);
    });
  });

  res.json(results);
});

/*********************************************lOGIN PAGE**********************************************************/

app.post("/login", async (req, res) => {
  const { user, password } = req.body;
  const db = await connectToDatabase();
  const collection = db.collection("users");

  const foundUser = await collection.findOne({ user, password });
  console.log("Trying login for", user, password);
  console.log("Found user:", foundUser);

  if (foundUser) {
    res.json({ success: true, role: foundUser.role });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

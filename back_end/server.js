const express = require("express");
const cors = require("cors");
const fs = require("fs");
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
app.get("/groceries", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const groceries = await db.collection("groceries").find().toArray();
    res.json(groceries);
  } catch (error) {
    console.error("Error fetching groceries:", error);
    res.status(500).json({ error: "Failed to fetch groceries" });
  }
});
// Add new product
app.post("/groceries/add-product", async (req, res) => {
  const { name, quantity, price } = req.body;

  if (!name || isNaN(quantity) || isNaN(price)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const db = await connectToDatabase();

    // Get current count
    const count = await db.collection("groceries").countDocuments();

    const newProduct = {
      id: count + 1, // ✅ Assign ID as count + 1
      name,
      quantity_kg_l: quantity,
      cost_per_unit: price,
      total_cost: quantity * price,
    };

    const result = await db.collection("groceries").insertOne(newProduct);

    res.json({
      message: "Product added successfully",
      product: { _id: result.insertedId, ...newProduct },
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.delete("/groceries/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("groceries");

    const product = await collection.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await collection.deleteOne({ id: productId });

    return res.json({
      message: `Product "${product.name}" removed successfully`,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

app.post("/groceries/:type", async (req, res) => {
  const { id, quantity, price, session, date } = req.body;

  try {
    const db = await connectToDatabase();
    const collection = db.collection("groceries");

    const product = await collection.findOne({ id: id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let updatedFields = {};

    if (req.params.type === "add") {
      const newTotalCost = product.total_cost + quantity * price;
      const newQuantity = product.quantity_kg_l + quantity;
      const newCostPerUnit = newTotalCost / newQuantity;

      updatedFields = {
        quantity_kg_l: newQuantity,
        cost_per_unit: newCostPerUnit,
        total_cost: newTotalCost,
      };
    } else if (req.params.type === "take") {
      if (product.quantity_kg_l < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      const newQuantity = product.quantity_kg_l - quantity;
      const newTotalCost = parseFloat(
        (newQuantity * product.cost_per_unit).toFixed(2)
      );

      updatedFields = {
        quantity_kg_l: newQuantity,
        total_cost: newTotalCost,
      };
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
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    await collection.updateOne({ id: id }, { $set: updatedFields });

    const updatedProduct = await collection.findOne({ id: id });

    res.json({ message: "Quantity updated", product: updatedProduct });
  } catch (err) {
    console.error("Error updating grocery:", err);
    res.status(500).json({ error: "Failed to update grocery" });
  }
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
// 🔍 Fetch announcements
app.get("/announcements", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("announcements");

    const announcements = await collection.find().toArray();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// ➕ Add announcement
app.post("/add-announcement", async (req, res) => {
  const { announcement, viewer } = req.body;
  if (!announcement)
    return res.status(400).json({ error: "Empty announcement" });

  try {
    const db = await connectToDatabase();
    const collection = db.collection("announcements");

    await collection.insertOne({ announcement, viewer });
    res.json({ message: "Announcement added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add announcement" });
  }
});

// ❌ Delete announcement by _id
app.post("/delete-announcement", async (req, res) => {
  const { announcement } = req.body;

  if (!announcement)
    return res.status(400).json({ error: "Missing announcement text" });

  try {
    const db = await connectToDatabase();
    const collection = db.collection("announcements");

    const result = await collection.deleteOne({ announcement });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Announcement not found" });

    res.json({ message: "Announcement deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
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
  console.log(foundUser.mess);
  if (foundUser) {
    res.json({ success: true, role: foundUser.role, mess: foundUser.mess });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

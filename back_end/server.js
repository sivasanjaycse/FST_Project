const express = require("express");
const cors = require("cors");
const fs = require("fs");
const connectToDatabase = require("./dbconnect");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
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
// 1️⃣ Fetch Current Menu
app.get("/menu/:messName", async (req, res) => {
  const messName = req.params.messName;
  try {
    const db = await connectToDatabase();
    const menu = await db.collection("menu").find({ mess: messName }).toArray();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// 2️⃣ Submit Menu Change Request (Stores in Pending Approval)
app.post("/update-menu", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newData = req.body;

    if (!Array.isArray(newData)) {
      return res.status(400).json({ error: "Menu data must be an array" });
    }

    await db.collection("menu_pending_approval").deleteMany({});
    await db.collection("menu_pending_approval").insertMany(newData);

    res.json({ message: "Menu update request submitted for approval." });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit menu update" });
  }
});

// 3️⃣ Fetch Pending Menu Changes
app.get("/pending-menu-updates", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const pending = await db
      .collection("menu_pending_approval")
      .find()
      .toArray();
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending menu updates" });
  }
});

// 4️⃣ Approve Menu Update
app.post("/approve-menu-update", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const approvedData = await db
      .collection("menu_pending_approval")
      .find()
      .toArray();
    if (approvedData.length === 0) {
      return res.status(404).json({ message: "No pending menu updates." });
    }

    await db.collection("menu").deleteMany({ mess: approvedData[0].mess });
    await db.collection("menu").insertMany(approvedData);
    await db.collection("menu_pending_approval").deleteMany({});

    res.json({ message: "Menu update approved and applied successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve menu update" });
  }
});
/************************FEEDBACK*************************************************************************************/

app.get("/feedback", async (req, res) => {
  const { date, session, messName } = req.query;

  if (!date || !session) {
    return res.status(400).json({ error: "Date and session required" });
  }

  try {
    const db = await connectToDatabase();
    const feedback = await db
      .collection("feedback")
      .find({ date, session, mess: messName })
      .toArray();

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
  } catch (error) {
    console.error("❌ Error fetching feedback:", error.message);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

/************************DAILY LOGS****************************************************************************************/

// Read daily logs
app.get("/daily-logs/:messName", async (req, res) => {
  const messName = req.params.messName;
  try {
    const db = await connectToDatabase();
    const logs = await db
      .collection("dailyLogs")
      .find({ mess: messName })
      .sort({ date: -1 })
      .toArray();
    res.json(logs);
  } catch (error) {
    console.error("❌ Error fetching daily logs:", error.message);
    res.status(500).json({ error: "Error fetching data from database" });
  }
});

// Add a new log entry
app.post("/daily-logs/:messName", async (req, res) => {
  const { date, session, studentCount } = req.body;
  const messName = req.params.messName;
  if (!date || !session || !studentCount) {
    return res
      .status(400)
      .json({ error: "Date, session, and student count required" });
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("dailyLogs").insertOne({
      date,
      session,
      studentCount,
      mess: messName,
    });

    res.json({
      message: "Log added successfully",
      log: result.ops?.[0] || { date, session, studentCount },
    });
  } catch (error) {
    console.error("❌ Error saving daily log:", error.message);
    res.status(500).json({ error: "Error saving data to database" });
  }
});

/*************************GROCERIES**************************************************************************************/
app.get("/groceries/:messName", async (req, res) => {
  const messName = req.params.messName;
  try {
    const db = await connectToDatabase();
    const groceries = await db
      .collection("groceries")
      .find({ mess: messName })
      .toArray();
    res.json(groceries);
  } catch (error) {
    console.error("Error fetching groceries:", error);
    res.status(500).json({ error: "Failed to fetch groceries" });
  }
});
app.get("/groceries", async (req, res) => {
  const messName = req.params.messName;
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
  const { name, quantity, price, mess } = req.body;

  if (!name || isNaN(quantity) || isNaN(price) || !mess) {
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
      mess,
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
      const totalCost = (quantity * product.cost_per_unit).toFixed(2);

      const usageCollection = db.collection("session_usage");

      const existingEntry = await usageCollection.findOne({
        date,
        session,
        mess: product.mess,
      });

      if (existingEntry) {
        const updatedCost = (
          parseFloat(existingEntry.totalCost) + parseFloat(totalCost)
        ).toFixed(2);

        await usageCollection.updateOne(
          { date, session, mess: product.mess },
          { $set: { totalCost: updatedCost } }
        );
      } else {
        await usageCollection.insertOne({
          date,
          session,
          totalCost,
          mess: product.mess,
        });
      }
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    await collection.updateOne({ id: id }, { $set: updatedFields });

    const updatedProduct = await collection.findOne({ id: id });
    console.log(updatedProduct);
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
app.get("/pending-approvals", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("student_preference_update");

    const pendingApprovals = await collection
      .find({ status: "Approval Pending" })
      .toArray();

    res.json(pendingApprovals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending approvals" });
  }
});

app.post("/approve-request", async (req, res) => {
  try {
    const { rollno } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection("student_preference_update");

    const result = await collection.findOneAndUpdate(
      { rollno },
      { $set: { status: "Approved" } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Request approved successfully",
      student: result.value,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve request" });
  }
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
const calculateWasteScore = async (date, session, db, messType) => {
  const dailyLogs = await db
    .collection("dailyLogs")
    .find({ mess: messType })
    .toArray();
  const feedbackData = await db
    .collection("feedback")
    .find({ mess: messType })
    .toArray();
  const sessionData = await db
    .collection("session_usage")
    .find({ mess: messType })
    .toArray(); // <-- updated!

  let totalCost = null;
  let studentCount = null;
  let overallRating = null;

  // Extract total cost from file
  const costEntry = sessionData.find(
    (entry) =>
      entry.date === date &&
      entry.session.toLowerCase() === session.toLowerCase()
  );
  if (costEntry) totalCost = parseFloat(costEntry.totalCost);

  // Extract student count from DB
  const countEntry = dailyLogs.find(
    (entry) =>
      entry.date === date &&
      entry.session.toLowerCase() === session.toLowerCase()
  );
  if (countEntry) studentCount = countEntry.studentCount;

  // Extract overall rating from DB
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
    overallRating = totalRating / matchingEntries.length;
  }

  // Handle missing data
  if (totalCost === null) {
    const avgCost =
      sessionData.reduce((sum, entry) => sum + parseFloat(entry.totalCost), 0) /
      sessionData.length;
    totalCost = avgCost || 1500;
  }

  if (studentCount === null) {
    const avgCount =
      dailyLogs.reduce((sum, entry) => sum + entry.studentCount, 0) /
      dailyLogs.length;
    studentCount = avgCount || 80;
  }

  if (overallRating === null) {
    const avgRating =
      feedbackData.reduce((sum, entry) => sum + entry.overall_rating, 0) /
      feedbackData.length;
    overallRating = avgRating || 2.97;
  }

  // Set the range of expected values for cost and student count for normalization
  const maxCost = 2000; // Adjust based on realistic values for cost
  const minCost = 500; // Adjust based on realistic values for cost
  const maxStudents = 500; // Adjust based on realistic student count
  const minStudents = 50; // Adjust based on realistic student count

  // Normalize total cost (lower cost means less waste, so we reverse it)
  const normalizedCost = (maxCost - totalCost) / (maxCost - minCost);

  // Normalize student count (more students means less waste)
  const normalizedStudentCount =
    (studentCount - minStudents) / (maxStudents - minStudents);

  // Normalize overall rating (higher rating means less waste)
  const normalizedRating = overallRating / 5; // Assuming rating is out of 5

  // Calculate the waste score by weighting the factors equally (33% each)
  const wasteScore =
    (0.33 * normalizedCost +
      0.33 * normalizedStudentCount +
      0.33 * normalizedRating) *
      90 +
    10;

  // Ensure waste score is within the 10 to 100 range
  const finalWasteScore = Math.max(10, Math.min(100, wasteScore));

  return {
    date,
    session,
    wasteScore: finalWasteScore.toFixed(2),
    totalCost: totalCost.toFixed(2),
    studentCount: Math.floor(studentCount),
    overallRating: overallRating.toFixed(2),
  };
};

app.get("/waste-score", async (req, res) => {
  try {
    const { date, session, messType } = req.query;
    const db = await connectToDatabase();

    const result = await calculateWasteScore(date, session, db, messType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error calculating waste score" });
  }
});

/**************************************Quality Management*****************************************************/
const calculateQualityScore = async (date, session, db, messType) => {
  const wasteData = await calculateWasteScore(date, session, db, messType);
  if (!wasteData) return null;

  const { wasteScore, overallRating } = wasteData;
  const qualityScore = (parseFloat(wasteScore) + (overallRating * 100) / 5) / 2;

  return {
    date,
    session,
    qualityScore: qualityScore.toFixed(2),
  };
};

app.get("/quality-score", async (req, res) => {
  try {
    const { date, messType } = req.query;
    const db = await connectToDatabase();

    const sessions = ["Breakfast", "Lunch", "Snacks", "Dinner"];
    const pastDates = Array.from({ length: 4 }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    const results = [];

    for (const d of pastDates) {
      for (const session of sessions) {
        const result = await calculateQualityScore(d, session, db, messType);
        if (result) results.push(result);
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Error calculating quality scores" });
  }
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

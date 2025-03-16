const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const groceriesFilePath = "./groceries.json";
const menuFilePath = "./menu.json"; // Added menu file path
const feedbackFile = "./feedback.json";

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

// Update quantity (Add or Take)
app.post("/groceries/:type", (req, res) => {
  const groceries = readJSONFile(groceriesFilePath);
  const { id, quantity, price } = req.body;
  const product = groceries.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (req.params.type === "add") {
    product.quantity_kg_l += quantity;
    product.cost_per_unit = price;
  } else if (req.params.type === "take") {
    product.quantity_kg_l = Math.max(0, product.quantity_kg_l - quantity);
  }

  product.total_cost = product.quantity_kg_l * product.cost_per_unit;
  writeJSONFile(groceriesFilePath, groceries);
  res.json({ message: "Quantity updated", product });
});

// **MENU API ROUTES**

// Fetch menu
app.get("/menu", (req, res) => {
  const menuData = readJSONFile(menuFilePath);
  res.json(menuData);
});

// Update menu
app.post("/update-menu", (req, res) => {
  const newData = req.body;
  writeJSONFile(menuFilePath, newData);
  res.json({ message: "Menu updated successfully" });
});
const readFeedback = () => {
  const data = fs.readFileSync(feedbackFile);
  return JSON.parse(data);
};

app.get("/feedback", (req, res) => {
  const { date } = req.query;
  const feedback = readFeedback().filter((item) => item.date === date);

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
const DATA_FILE = "dailyLogs.json";

// Read daily logs
app.get("/daily-logs", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });
    res.json(JSON.parse(data));
  });
});

// Add a new log entry
app.post("/daily-logs", (req, res) => {
  const { date, studentCount } = req.body;

  if (!date || !studentCount) {
    return res.status(400).json({ error: "Date and student count required" });
  }

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    let logs = JSON.parse(data);
    logs.push({ date, studentCount });

    fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Error saving data" });
      res.json({ message: "Log added successfully", logs });
    });
  });
});
app.listen(5000, () => console.log("Server running on port 5000"));

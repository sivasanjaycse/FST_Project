const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const groceriesFilePath = "./groceries.json";
const menuFilePath = "./menu.json"; // Added menu file path

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

app.listen(5000, () => console.log("Server running on port 5000"));

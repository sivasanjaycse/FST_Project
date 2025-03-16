const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const filePath = "./groceries.json";

// Read groceries from JSON file
const readGroceries = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Write groceries to JSON file
const writeGroceries = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Fetch all groceries
app.get("/groceries", (req, res) => {
  res.json(readGroceries());
});

// Add new product
app.post("/groceries/add-product", (req, res) => {
  const groceries = readGroceries();
  const { name, quantity, price } = req.body;
  
  if (!name || isNaN(quantity) || isNaN(price)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const newProduct = {
    id: groceries.length + 1,
    name,
    quantity_kg_l: quantity,
    cost_per_unit: price,
    total_cost: quantity * price
  };

  groceries.push(newProduct);
  writeGroceries(groceries);

  res.json({ message: "Product added successfully", product: newProduct });
});

// Update quantity (Add or Take)
app.post("/groceries/:type", (req, res) => {
  const groceries = readGroceries();
  const { id, quantity, price } = req.body;
  const product = groceries.find(item => item.id === id);

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
  writeGroceries(groceries);
  res.json({ message: "Quantity updated", product });
});

app.listen(5000, () => console.log("Server running on port 5000"));

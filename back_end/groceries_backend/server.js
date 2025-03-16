const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "groceries.json";

// Load grocery data from file
const loadGroceries = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

// Save grocery data to file
const saveGroceries = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
};

// GET all groceries
app.get("/groceries", (req, res) => {
    res.json(loadGroceries());
});

// POST to add or take items
app.post("/groceries/:action", (req, res) => {
    const { id, quantity, price } = req.body;
    const action = req.params.action;
    let groceries = loadGroceries();
    
    const index = groceries.findIndex(item => item.id === id);
    if (index === -1) return res.status(404).json({ error: "Item not found" });

    if (action === "add") {
        groceries[index].quantity_kg_l += quantity;
        groceries[index].cost_per_unit = price;
    } else if (action === "take") {
        groceries[index].quantity_kg_l = Math.max(0, groceries[index].quantity_kg_l - quantity);
    }

    groceries[index].total_cost = groceries[index].quantity_kg_l * groceries[index].cost_per_unit;
    
    saveGroceries(groceries);
    res.json({ message: "Updated successfully", groceries });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


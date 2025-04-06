// dbconnect.js
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "digitalmessDB";

let dbInstance = null;

async function connectToDatabase() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log("✅ Connected to MongoDB database:", dbName);
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("❌ Error connecting to the database:\n", err.message);
    throw err;
  }
}

module.exports = connectToDatabase;

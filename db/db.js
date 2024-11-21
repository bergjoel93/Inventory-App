// db/db.js
require("dotenv").config();
const { Pool } = require("pg");
console.log("Database_Url", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1); // Exit the process if the database URL is missing
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Railway
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => {
    try {
      return pool.query(text, params);
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

// db/createTables.js
const db = require("./db");

const createTables = async () => {
  try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                categoryId SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                description TEXT,
                imgURL TEXT
            );
        `);

    await db.query(`
            CREATE TABLE IF NOT EXISTS plants (
                plantId SERIAL PRIMARY KEY,
                categoryId INTEGER REFERENCES categories(categoryId),
                name VARCHAR(50) NOT NULL,
                scientificName VARCHAR(100),
                quantity INTEGER,
                description TEXT,
                imgURL TEXT
            );
        `);

    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    process.exit();
  }
};

createTables();

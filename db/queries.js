// /db/queries.js
// queries.js
const db = require("./db");

const DEFAULT_IMAGE_URL =
  "https://banner2.cleanpng.com/20180404/hqe/avhx8fkiv.webp";

// Function to get a single plant by plantId
const getPlantById = async (plantId) => {
  try {
    const result = await db.query(
      "SELECT * FROM plants WHERE plantId = $1", // SQL query
      [plantId] // Pass plantId as a parameter
    );
    return result.rows[0]; // Return the first row (since IDs are unique, there should only be one result)
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    throw error;
  }
};

// Function to get all plants by categoryId
const getPlantsByCategoryId = async (categoryId) => {
  try {
    const result = await db.query(
      "SELECT * FROM plants WHERE categoryId = $1", // SQL query
      [categoryId] // Pass categoryId as a parameter
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching plants by category ID:", error);
    throw error;
  }
};

// Get all categories
const getAllCategories = async () => {
  try {
    const result = await db.query("SELECT * FROM categories");
    //console.log("Categories", result);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get a single category by ID
const getCategoryById = async (categoryId) => {
  try {
    const result = await db.query(
      "SELECT * FROM categories WHERE categoryId = $1",
      [categoryId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};

const updatePlantQuantity = async (plantId, quantity) => {
  try {
    await db.query("UPDATE plants SET quantity = $1 WHERE plantid = $2", [
      quantity,
      plantId,
    ]);
    console.log("PlantId: ", plantId, "updated to: ", quantity);
  } catch (error) {
    console.error("Error updating plant quantity:", error);
    throw error;
  }
};

const updatePlant = async (
  plantId,
  name,
  scientificName,
  description,
  imgURL,
  quantity,
  categoryId
) => {
  try {
    const result = await db.query(
      `UPDATE plants 
       SET name = $1, scientificname = $2, description = $3, imgurl = $4, quantity = $5, categoryid = $6
       WHERE plantid = $7`,
      [name, scientificName, description, imgURL, quantity, categoryId, plantId]
    );
    return result;
  } catch (error) {
    console.error("Error updating plant:", error);
    throw error;
  }
};

const addCategory = async (name, description, imgURL = null) => {
  try {
    const result = await db.query(
      `INSERT INTO categories (name, description, imgURL)
       VALUES ($1, $2, COALESCE($3, $4))
       RETURNING *`,
      [name, description, imgURL, DEFAULT_IMAGE_URL]
    );
    return result.rows[0]; // Return the newly added category
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

const getCategoryByName = async (name) => {
  try {
    const result = await db.query("SELECT * FROM categories WHERE name = $1", [
      name,
    ]);
    return result.rows[0] || null; // Return the first matching category or null if not found
  } catch (error) {
    console.error("Error fetching category by name:", error);
    throw error;
  }
};

// Export the functions for use in other parts of your app
module.exports = {
  getAllCategories,
  getCategoryById,
  getPlantsByCategoryId,
  getPlantById,
  updatePlantQuantity,
  updatePlant,
  addCategory,
  getCategoryByName,
};

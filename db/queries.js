// /db/queries.js
// queries.js
const db = require("./db");

const DEFAULT_IMAGE_URL = "/img/defaultImg.png";

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
  scientificName,
  description,
  imgURL,
  quantity
) => {
  try {
    const result = await db.query(
      `UPDATE plants 
       SET scientificname = $1, description = $2, imgurl = $3, quantity = $4
       WHERE plantid = $5`,
      [scientificName, description, imgURL, quantity, plantId]
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

// Function to add a new plant to the database
// Function to add a new plant to the database
const addPlant = async (
  name,
  scientificname,
  description,
  imgurl,
  quantity,
  categoryid
) => {
  try {
    const result = await db.query(
      `INSERT INTO plants (name, scientificname, description, imgurl, quantity, categoryid) 
       VALUES ($1, $2, $3, COALESCE($4, $5), $6, $7) 
       RETURNING *`,
      [
        name,
        scientificname,
        description,
        imgurl,
        DEFAULT_IMAGE_URL,
        quantity,
        categoryid,
      ]
    );
    return result.rows[0]; // Returns the newly created plant record
  } catch (error) {
    console.error("Error adding new plant:", error);
    throw error;
  }
};

// Get plant in db by name.
const getPlantByName = async (name) => {
  try {
    const result = await db.query(
      "SELECT * FROM plants WHERE LOWER(name) = LOWER($1)", // SQL query to match name case-insensitively
      [name] // Pass the plant name as a parameter
    );
    return result.rows[0]; // Return the first matching plant (assuming unique names)
  } catch (error) {
    console.error("Error fetching plant by name:", error);
    throw error;
  }
};

// Function to delete a plant by plantId
const deletePlantById = async (plantId) => {
  console.log(plantId);
  try {
    const result = await db.query(
      "DELETE FROM plants WHERE plantid = $1 RETURNING *",
      [plantId]
    );

    return result.rows[0]; // Return the deleted plant's details for confirmation
  } catch (error) {
    console.error("Error deleting plant by ID:", error);
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
  addPlant,
  getPlantByName,
  deletePlantById,
};

// controllers/categoriesController.js
/**
 * This module contains: getCategories, createNewCategoryIfNeeded.
 */
const queries = require("../db/queries"); // Import the queries file

//
const getEditCategories = async (req, res) => {
  try {
    const categories = await queries.getAllCategories();
    res.render("index", {
      title: "Edit Categories",
      body: "editCategories",
      categories: categories,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).send("Error retrieving categories");
  }
};

// Define getCategories function
const getCategories = async (req, res) => {
  try {
    const categories = await queries.getAllCategories();
    //console.log("categories", categories);
    res.render("index", {
      title: "Plant Categories",
      body: "categories", // Set the partial view name for dynamic inclusion
      categories: categories, // Pass the categories data to the template
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).send("Error retrieving categories");
  }
};

// Helper function to create a new category if needed
const createNewCategoryIfNeeded = async (
  category,
  newCategoryName,
  categoryDescription,
  categoryImgUrl,
) => {
  if (category === "other-type") {
    // Add the new category to the database
    const newCategory = await queries.addCategory(
      newCategoryName,
      categoryDescription,
      categoryImgUrl,
    );
    return newCategory.categoryid;
  }
  return category; // If not "other-type", return the original category ID
};

module.exports = {
  getCategories,
  createNewCategoryIfNeeded,
  getEditCategories,
};

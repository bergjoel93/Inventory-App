// controllers/getPlantsController.js
/**
 * This module contains: getPlantsByCategory, getPlant, getEditPlantPage, getNewPlantForm
 */

const queries = require("../db/queries"); // Import the queries file
// get's all of the plants of a specific category based on category ID.
const getPlantsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryid; // Get categoryId from the URL parameters.
    const plants = await queries.getPlantsByCategoryId(categoryId); // pass categoryId to the query.
    const category = await queries.getCategoryById(categoryId);
    //console.log("Plants in category: ", plants);
    // Render the plants.ejs view and pass the plants data!
    res.render("index", {
      title: "Plant List",
      body: "plants",
      plants: plants,
      categoryName: category.name, // pass category name to template.
    });
  } catch (error) {
    console.error("Error retrieving plants by category:", error);
    res.status(500).send("Error retrieving plants by category");
  }
};

// Get's a specific plant
const getPlant = async (req, res) => {
  try {
    const plantId = req.params.plantid; // get plantid from the URL parameters
    const plant = await queries.getPlantById(plantId); // Fetch plant by ID

    const category = await queries.getCategoryById(plant.categoryid);
    if (plant) {
      // Render a plant details view (e.g., plant.ejs) and pass the plant data
      res.render("index", {
        title: plant.name,
        category: category,
        body: "plant",
        plant: plant,
      });
    } else {
      res.status(404).send("Plant not found.");
    }
  } catch (error) {
    console.error("Error retrieving plant by ID:", error);
    res.status(500).send("Error retrieving plant by ID");
  }
};

const getEditPlantPage = async (req, res) => {
  const plantId = req.params.plantid;
  const plant = await queries.getPlantById(plantId);
  const categories = await queries.getAllCategories();

  // Retrieve and decode errors from the query string, if present
  const errors = req.query.errors
    ? JSON.parse(decodeURIComponent(req.query.errors))
    : [];
  console.log("Errors", errors);

  if (plant) {
    res.render("index", {
      title: `Edit ${plant.name}`,
      plant: plant,
      body: "edit",
      categories: categories,
      errors: errors,
    });
  }
};

const getNewPlantForm = async (req, res) => {
  const categories = await queries.getAllCategories();
  req.categores =
    categories / // Attach categories to req for validation middleware.
    res.render("index", {
      title: "Add New Plant",
      categories: categories,
      body: "add",
      errors: [],
    });
};

module.exports = {
  getNewPlantForm,
  getEditPlantPage,
  getPlant,
  getPlantsByCategory,
};

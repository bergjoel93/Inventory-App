// controllers/getPlantsController.js
/**
 * This module contains: postAddNewPlant, updateQuantity, postUpdatePlant
 */
const { validationResult } = require("express-validator"); // import express validator
const queries = require("../db/queries"); // Import the queries file
// Add New Plant and Sanitize form data.

const validator = require("../validators/plantValidator");

const postAddNewPlant = [
  validator.validateNewPlant,
  async (req, res) => {
    const errors = validationResult(req);
    const categories = await queries.getAllCategories();

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        title: "Add New Plant",
        categories: categories,
        body: "add",
        errors: errors.array(),
      });
    }

    const {
      name,
      scientificname,
      description,
      imgurl,
      quantity,
      category, // Can be an existing category ID or "other-type"
      newCategoryName,
      categoryDescription,
      categoryImgUrl,
    } = req.body;

    // Set imgurl to null if it's an empty string
    const processedImgUrl = imgurl.trim() === "" ? null : imgurl;

    try {
      const categoryId = await createNewCategoryIfNeeded(
        // if new category created, will return id.
        category,
        newCategoryName,
        categoryDescription,
        categoryImgUrl
      ); //
      // Add the new plant to the database
      await queries.addPlant(
        name,
        scientificname,
        description,
        processedImgUrl,
        quantity,
        categoryId
      );
      const newPlant = await queries.getPlantByName(name);
      const newPlantId = newPlant ? newPlant.plantid : null;
      res.redirect(`/plant/${newPlantId}`); // redirect to new plant page.
    } catch (error) {
      console.error("Error retrieving :", error);
      res.status(500).send("Error retrieving categories");
    }
  },
];

// Update the quantity

const updateQuantity = async (req, res) => {
  const plantId = req.params.plantid;
  const newQuantity = req.body.quantity;

  try {
    await queries.updatePlantQuantity(plantId, newQuantity); // Query to update quantity in the database
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Failed to update quantity" });
  }
};

const postUpdatePlant = [
  validator.validateOldPlant,
  async (req, res) => {
    const plantId = req.params.plantid;
    const plant = queries.getPlantById(plantId);
    const categories = await queries.getAllCategories();
    const errors = validationResult(req);

    // console.log("Errors", errors);

    if (!errors.isEmpty()) {
      // Serialize errors and form data to pass them in the query parameters
      const errorMessages = encodeURIComponent(JSON.stringify(errors.array()));
      return res.redirect(`/plant/edit/${plantId}?errors=${errorMessages}`);
    }
    // Retrieve updated data from req.body
    const { scientificname, description, imgurl, quantity, category } =
      req.body;

    try {
      // Update the plant in the database
      await queries.updatePlant(
        plantId,
        scientificname,
        description,
        imgurl,
        quantity,
        category
      );

      // Redirect back to the updated plant’s detail page
      res.redirect(`/plant/${plantId}`);
    } catch (error) {
      console.error("Error updating plant:", error);
      res.status(500).send("Error updating plant");
    }
  },
];

const postDeletePlant = async (req, res) => {
  queries.deletePlantById(req.params.plantid);
  const categoryid = req.params.categoryid;
  res.redirect(`/plants/${categoryid}`);
};

// Helper function to create a new category if needed
const createNewCategoryIfNeeded = async (
  category,
  newCategoryName,
  categoryDescription,
  categoryImgUrl
) => {
  if (category === "other-type") {
    // Add the new category to the database
    const newCategory = await queries.addCategory(
      newCategoryName,
      categoryDescription,
      categoryImgUrl
    );
    return newCategory.categoryid;
  }
  return category; // If not "other-type", return the original category ID
};

module.exports = {
  postAddNewPlant,
  updateQuantity,
  postUpdatePlant,
  postDeletePlant,
};

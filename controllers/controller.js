// controllers/controller.js
const queries = require("../db/queries"); // Import the queries file

const { validateCategoryData } = require("../validators/categoryValidator");

// Add New Plant and Sanitize form data.
const postAddNewPlant = async (req, res) => {
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
    console.log("imgurl:", imgurl);

    res.redirect(`/plant/${newPlantId}`); // redirect to new plant page.
  } catch (error) {
    console.error("Error retrieving :", error);
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

const getEditPlantPage = async (req, res) => {
  const plantId = req.params.plantid;
  const plant = await queries.getPlantById(plantId);
  const categories = await queries.getAllCategories();
  if (plant) {
    res.render("index", {
      title: `Edit ${plant.name}`,
      plant: plant,
      body: "edit",
      categories: categories,
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

const postUpdatePlant = async (req, res) => {
  const plantId = req.params.plantid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation errors, retreive categories and re-render form with errors.
    const categories = await queries.getAllCategories();
    return res.status(400).render("index", {
      title: "Add new plant",
      categories: categories,
      body: "add",
      errors: errors.array(), // pass validation errors to view
      formData: req.body, // Pass current form data to repopulate the form.
    });
  }

  // Retrieve updated data from req.body
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

  try {
    // Determine the correct category ID (either an existing one or a newly created one)
    const categoryId = await createNewCategoryIfNeeded(
      category,
      newCategoryName,
      categoryDescription,
      categoryImgUrl
    );

    // Update the plant in the database
    await queries.updatePlant(
      plantId,
      name,
      scientificname,
      description,
      imgurl,
      quantity,
      categoryId
    );

    // Redirect back to the updated plant’s detail page
    res.redirect(`/plant/${plantId}`);
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).send("Error updating plant");
  }
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
  getCategories,
  getPlantsByCategory,
  getPlant,
  updateQuantity,
  getEditPlantPage,
  postUpdatePlant,
  getNewPlantForm,
  postAddNewPlant,
};

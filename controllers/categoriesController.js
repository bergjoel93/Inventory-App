// controllers/categoriesController.js
/**
 * This module contains: getCategories, createNewCategoryIfNeeded.
 */
const queries = require("../db/queries"); // Import the queries file
const { body, validationResult } = require("express-validator");
const validator = require("../validators/categoryValidator");
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

const getEditCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const category = await queries.getCategoryById(categoryId);
    res.render("index", {
      title: `Edit ${category.name}`,
      category: category,
      body: "editCategory",
      errors: [],
    });
  } catch (error) {
    console.error("Error retrieving category:", error);
    res.status(500).send("Error retrieving category");
  }
};

const postDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const category = await queries.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found.");
    }

    // Delete the category and associated plants
    await queries.deleteCategoryById(categoryId);

    // Redirect to the homepage after deletion
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Error deleting category");
  }
};

const getAddNewCategory = async (req, res) => {
  res.render("index", {
    title: "Add New Category",
    body: "addNewCategory",
    oldData: { name: "", description: "", imgurl: "" },
    errors: [],
  });
};

const postAddNewCategory = [
  validator.validateCategory,
  async (req, res) => {
    const errors = validationResult(req);
    const { name, description, imgurl } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        title: "Add New Category",
        body: "addNewCategory",
        oldData: { name: name, description: description, imgurl: imgurl },
        errors: errors.array(),
      });
    }

    // Set imgurl to null if it's an empty string
    const processedImgUrl = imgurl.trim() === "" ? null : imgurl;

    try {
      const newCategory = await queries.addCategory(
        name,
        description,
        processedImgUrl
      );
      const newCategoryId = newCategory.categoryid;
      res.redirect(`/editCategories`);
    } catch (error) {
      console.error("Error adding new category:", error);
      res.status(500).send("Error adding new category");
    }
  },
];

const postUpdateCategory = [
  validator.validateCategory,
  async (req, res) => {
    const { name, description, imgurl } = req.body;
    const categoryId = req.params.categoryid;
    const category = await queries.getCategoryById(categoryId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        title: "Edit Category",
        body: `editCategory`,
        oldData: { name: name, description: description, imgurl: imgurl },
        category: category,
        errors: errors.array(),
      });
    }
    try {
      await queries.updateCategoryById(categoryId, name, description, imgurl);
      res.redirect(`/editCategories`);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).send("Error updating");
    }
  },
];

module.exports = {
  getCategories,
  getEditCategories,
  getEditCategory,
  postDeleteCategory,
  postAddNewCategory,
  getAddNewCategory,
  postUpdateCategory,
};

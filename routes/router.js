// routes/router.js

const express = require("express");

require("dotenv").config();

const router = express.Router();

const controller = require("../controllers/controller");
const getPlantsController = require("../controllers/getPlantsController");
const postPlantsController = require("../controllers/postPlantsController");
const categoriesController = require("../controllers/categoriesController");

const {
  validatePlant,
  checkValidationResults,
} = require("../validators/plantValidator");
// Home
router.get("/", categoriesController.getCategories);
//Partial to display all categoires.
router.get("/plants/:categoryid", getPlantsController.getPlantsByCategory);
// Partial to display individual Plant Page
router.get("/plant/:plantid", getPlantsController.getPlant);
// updates the plant quantity
router.post("/update-quantity/:plantid", postPlantsController.updateQuantity);
// sends use to edit plant page.
router.get("/plant/edit/:plantid", getPlantsController.getEditPlantPage);
// updates the plant data
router.post("/plant/update/:plantid", postPlantsController.postUpdatePlant);
// Sends user to add a new plant page
router.get("/add", getPlantsController.getNewPlantForm);
// adds a new plant to the database.
router.post("/add/new", postPlantsController.postAddNewPlant);
// deletes plant from the database.
router.post(
  "/delete/plant/:plantid/:categoryid",
  postPlantsController.postDeletePlant,
);
router.get("/editCategories", categoriesController.getEditCategories);

module.exports = router;

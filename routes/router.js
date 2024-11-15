// routes/router.js

const express = require("express");

require("dotenv").config();

const router = express.Router();

const controller = require("../controllers/controller");

const {
  validatePlant,
  checkValidationResults,
} = require("../validators/plantValidator");

router.get("/", controller.getCategories);
router.get("/plants/:categoryid", controller.getPlantsByCategory);
router.get("/plant/:plantid", controller.getPlant);
router.post("/update-quantity/:plantid", controller.updateQuantity);
router.get("/plant/edit/:plantid", controller.getEditPlantPage);
router.post("/plant/update/:plantid", controller.postUpdatePlant);
router.get("/add", controller.getNewPlantForm);
router.post(
  "/add/new",
  validatePlant,
  checkValidationResults,
  controller.postAddNewPlant
);

module.exports = router;

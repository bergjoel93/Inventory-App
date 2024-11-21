// validators/plantValidator.js
const queries = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateOldPlant = [
  body("scientificname")
    .trim()
    .notEmpty()
    .withMessage("Scientific name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Scientific name must be between 2 and 60 characters.")
    .escape()
    .customSanitizer((value) => {
      return value.replace(/&#x27;/g, "'"); // Restore single quotes
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .escape()
    .customSanitizer((value) => {
      return value
        .replace(/&#x27;/g, "'") // Restore single quotes
        .replace(/&quot;/g, '"') // Restore double quotes
        .replace(/&amp;/g, "and") // Restore ampersands
        .replace(/&lt;/g, "[") // Restore less-than signs
        .replace(/&gt;/g, "]"); // Restore greater-than signs
    }),

  body("imgurl")
    .trim()
    .optional({ checkFalsy: true }) // This allows empty or undefined values
    .custom((value) => {
      // Allow the specific string "/img/defaultImg.png"
      if (value === "/img/defaultImg.png") {
        return true;
      }
      // Otherwise, check if it's a valid URL
      if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
        throw new Error(
          "Image URL must be a valid URL or '/img/defaultImg.png'."
        );
      }
      return true;
    }),
];

const validateNewPlant = [
  // General plant validations
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Plant name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Plant name must be between 2 and 60 characters.")
    .custom(async (value) => {
      const existingPlant = await queries.getPlantByName(value);
      if (existingPlant) {
        throw new Error("A plant with this name already exists.");
      }
    })
    .customSanitizer((value) => {
      return value.replace(/&#x27;/g, "'"); // Restore single quotes
    }),

  body("scientificname")
    .trim()
    .notEmpty()
    .withMessage("Scientific name is required.")
    .isLength({ min: 2, max: 60 })
    .escape()
    .withMessage("Scientific name must be between 2 and 60 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .escape()
    .customSanitizer((value) => {
      return value
        .replace(/&#x27;/g, "'") // Restore single quotes
        .replace(/&quot;/g, '"') // Restore double quotes
        .replace(/&amp;/g, "&") // Restore ampersands
        .replace(/&lt;/g, "<") // Restore less-than signs
        .replace(/&gt;/g, ">"); // Restore greater-than signs
    }),

  body("imgurl")
    .trim()
    .optional({ checkFalsy: true }) // This allows empty or undefined values
    .custom((value) => {
      // Allow the specific string "/img/defaultImg.png"
      if (value === "/img/defaultImg.png") {
        return true;
      }
      // Otherwise, check if it's a valid URL
      if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
        throw new Error(
          "Image URL must be a valid URL or '/img/defaultImg.png'."
        );
      }
      return true;
    }),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive number.")
    .toInt(),

  body("category").notEmpty().withMessage("Category is required."),

  // Conditional validation for new category fields
  body("newCategoryName")
    .if(body("category").equals("other-type"))
    .trim()
    .notEmpty()
    .withMessage("New category name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("New category name must be between 2 and 60 characters.")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("New category name must only contain letters and spaces.")
    .escape()
    .custom(async (value) => {
      const existingCategory = await queries.getCategoryByName(value);
      if (existingCategory) {
        throw new Error("A category with this name already exists.");
      }
    }),

  body("categoryDescription")
    .if(body("category").equals("other-type"))
    .trim()
    .notEmpty()
    .withMessage("New category description is required.")
    .isLength({ min: 1 })
    .customSanitizer((value) => {
      return value
        .replace(/&#x27;/g, "'") // Restore single quotes
        .replace(/&quot;/g, '"'); // Restore double quotes
    })
    .escape(),

  body("categoryImgUrl")
    .if(body("category").equals("other-type"))
    .trim()
    .optional()
    .isURL()
    .withMessage("New category image URL must be valid."),
];

module.exports = {
  validateNewPlant,
  validateOldPlant,
  // checkValidationResults,
};

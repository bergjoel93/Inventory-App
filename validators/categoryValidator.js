// validators/categoryValidator.js
const { body, validationResult } = require("express-validator");

// Validation function to validate category data on demand
const validateCategoryData = async (req) => {
  await body("newCategoryName")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Category name must be between 2 and 60 characters.")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Category name must only contain letters and spaces.")
    .run(req);

  await body("categoryDescription")
    .trim()
    .notEmpty()
    .withMessage("Category description is required.")
    .isLength({ min: 1, max: 300 })
    .withMessage("Category description must be between 1 and 300 characters.")
    .run(req);

  await body("categoryImgUrl")
    .trim()
    .optional()
    .isURL()
    .withMessage("Category image URL must be a valid URL.")
    .run(req);

  // Return validation errors, if any
  return validationResult(req);
};

module.exports = {
  validateCategoryData,
};

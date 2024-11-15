// validators/plantValidator.js
const { body, validationResult } = require("express-validator");

const validatePlant = [
  // General plant validations
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Plant name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Plant name must be between 2 and 60 characters.")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Plant name must only contain letters and spaces.")
    .escape(),

  body("scientificname")
    .trim()
    .notEmpty()
    .withMessage("Scientific name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Scientific name must be between 2 and 60 characters.")
    .escape(),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ max: 300 })
    .withMessage("Description must be under 300 characters.")
    .escape(),

  body("imgurl")
    .trim()
    .optional({ checkFalsy: true }) // This allows empty or undefined values
    .isURL()
    .withMessage("Image URL must be a valid URL."),

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
    .escape(),

  body("categoryDescription")
    .if(body("category").equals("other-type"))
    .trim()
    .notEmpty()
    .withMessage("New category description is required.")
    .isLength({ min: 1, max: 300 })
    .withMessage("New category description must be under 300 characters.")
    .escape(),

  body("categoryImgUrl")
    .if(body("category").equals("other-type"))
    .trim()
    .optional()
    .isURL()
    .withMessage("New category image URL must be valid."),
];

const checkValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, render the form with the errors and repopulated data
    const categories = req.categories || [];
    return res.status(400).render("index", {
      title: "Add New Plant",
      body: "add",
      categories: categories, // You should fetch this in your controller before rendering
      errors: errors.array(), // Pass the validation errors to the view
      formData: req.body, // Repopulate the form with the current data
    });
  }
  console.log("No errors found");
  next();
};

module.exports = {
  validatePlant,
  checkValidationResults,
};

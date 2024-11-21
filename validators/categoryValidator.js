// validators/categoryValidator.js
const { body, validationResult } = require("express-validator");
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Category name must be between 2 and 60 characters.")
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
];

module.exports = { validateCategory };

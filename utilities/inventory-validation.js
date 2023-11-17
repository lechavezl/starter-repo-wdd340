const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Name Validation Rules
 * ********************************* */
validate.addNewClassificationRules = () => {
    return [
      // Classification name is required and must be string with no spaces or special characters
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .matches(/^[A-zA-z]+$/)
        .withMessage("Please provide a valid classification name."), // on error this message is sent
  
    ]
}

/*  **********************************
 *  Add New Inventory Car Validation Rules
 * ********************************* */
validate.addNewInventoryCarRules = () => {
  return [
    // Classification name is required and must be selected
    body("classification_id")
    .custom((value, { req }) => {
      if (!value) {
        throw new Error("A classification name is required. Please select one.");
      }
      return true; // La validación pasa si value no es nulo ni una cadena vacía
    })
      .withMessage("A classification name is required. Plase select one."), // on error this message is sent.

    // Make is required and must be min 3 characters
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z\s]{3,}$/)
      .withMessage("The vehicle's Make is required and must min 3 characters."), // on error this message is sent.

    // Make is required and must be min 3 characters
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z\s]{3,}$/)
      .withMessage("The vehicle's Model is required and must min 3 characters."),

    // Description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The vehicle's description is required."),

    // Image Path is required
    body("inv_image")
      .trim()
      .isLength({ min: 1})
      .withMessage("The vehicle's image path is required."),
    
    // Thumbnail is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1})
      .withMessage("The vehicle's thumbnail image path is required."),
    
    // Price is required and must be a decimal or integer
    body("inv_price")
      .trim()
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("The Vehicle's price is required and must be a decimal or integer"),
    
    // Year is required and must be a 4-digit year
    body("inv_year")
      .trim()
      .matches(/^\d{4}$/)
      .withMessage("The Vehicle's year is required and must be 4-digit year"),
    
    // Miles is required and must be digits only
    body("inv_miles")
      .trim()
      .matches(/^\d+$/)
      .withMessage("The Vehicle's miles are required and must be digits only"),
    
    // Color is required and must be letters with spaces
    body("inv_color")
      .trim()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("The Vehicle's color is required")
  ]
}

/* ******************************
 * Check data and return errors or continue adding the new classification
 * ***************************** */
validate.checkNewClassificationData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
      })
      return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue adding the new inventory car
 * ***************************** */
validate.checkNewVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let dropDownClassification = await utilities.dropDownClassification(classification_id);
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      dropDownClassification,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate
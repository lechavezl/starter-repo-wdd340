const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildProductViewDetailsById = async function (req, res, next) {
  const inv_id = req.params.invtId
  const data = await invModel.getProductById(inv_id)
  const grid = await utilities.buildProductViewDetailsGrid(data)
  const nav = await utilities.getNav()
  const productMake = data[0].inv_make
  const productModel = data[0].inv_model
  const productYear = data[0].inv_year
  // const productPrice = data[0].inv_price
  res.render("/inventory/productDetails", {
    title: productYear + ' ' + productMake + ' ' + productModel,
    nav,
    grid,
  })
}

// Create and throw an intentional 500 error
invCont.generateIntentionalError = async function (req, res, next) {
  // throw an intentional 500 error
  const error = new Error('This is an intentional 500-type error');
  error.status = 500;
  throw error;
}

// Build and display the Inventory Management View
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

// Build and display the Add New Classification form
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();  
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

// Build and display the Add New Inventory Vehicle form
invCont.buildNewInventoryVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let dropDownClassification = await utilities.dropDownClassification();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    dropDownClassification,
    errors: null,
  })
}

/* ****************************************
*  Adding a New Classification Process
* *************************************** */
invCont.addNewClassificationProcess = async function (req, res, next) {
  const { classification_name } = req.body

  const addClassificationResult = await invModel.addNewClassification(classification_name)

  if (addClassificationResult) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `New Classification name ${classification_name} has been added.`
    )
    res.status(201).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we cound't add the new classification name.")
    req.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Adding a New Inventory Item Process
* *************************************** */
invCont.addNewVehicleProcess = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make, inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

  const price = parseInt(inv_price);
  const miles = parseInt(inv_miles);
  const classificationId = parseInt(classification_id);

  const addNewVehibleResult = await invModel.addNewVehicle(
    classificationId,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    price,
    inv_year,
    miles,
    inv_color
  )

  if (addNewVehibleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was succesfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we cound't add the new vehicle to the inventory.")
    req.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont
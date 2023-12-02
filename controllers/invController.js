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
  res.render("./inventory/productDetails", {
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
  const classificationSelect = await utilities.dropDownClassification()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
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
  
  const classificationSelect = await utilities.dropDownClassification()
  const addClassificationResult = await invModel.addNewClassification(classification_name)

  if (addClassificationResult) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `New Classification name ${classification_name} has been added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Add New Classification",
      nav,
      errors: null,
      classificationSelect,
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
    inv_make,
    inv_model,
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

  const classificationSelect = await utilities.dropDownClassification()
  const addNewVehibleResult = await invModel.addNewVehicle(
    classification_id,
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
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit view to update a vehicle in the inventory
 * ************************** */
invCont.buildEditVehicleView = async (req, res, next) => {
  const inv_id = parseInt(req.params.edit_invId)
  let nav = await utilities.getNav()
  const invData = await invModel.getProductById(inv_id)
  let dropDownClassification = await utilities.dropDownClassification(invData[0].classification_id);
  const vehicleName = `${invData[0].inv_make} ${invData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + vehicleName,
    nav,
    dropDownClassification,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_description: invData[0].inv_description,
    inv_image: invData[0].inv_image,
    inv_thumbnail: invData[0].inv_thumbnail,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    inv_color: invData[0].inv_color,
    classification_id: invData[0].classification_id
  })
}

/* ****************************************
*  Updating an Inventory (Vehicle) Process
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const price = parseInt(inv_price);
  const miles = parseInt(inv_miles);

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    price,
    inv_year,
    miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was succesfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.dropDownClassification(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    req.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete view to delete a vehicle in the inventory
 * ************************** */
invCont.buildDeleteVehicleView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const invData = await invModel.getProductById(inv_id)
  const vehicleName = `${invData[0].inv_make} ${invData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + vehicleName,
    nav,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_price: invData[0].inv_price,
    inv_year: invData[0].inv_year,
  })
}

/* ****************************************
*  Delete Inventory (Vehicle) Process
* *************************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", `The deletion was succesfull.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/delete/inv_id")
  }
}

module.exports = invCont
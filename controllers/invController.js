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

invCont.generateIntentionalError = async function (req, res, next) {
  // throw an intentional 500 error
  const error = new Error('This is an intentional 500-type error');
  error.status = 500;
  throw error;
}

module.exports = invCont
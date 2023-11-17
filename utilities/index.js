const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img class="inventory-img" src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildProductViewDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="details-content">'
      grid += '<div class="vehicle-img-box">'
      grid += '<img class="vehicle-detail-img" src="' + data[0].inv_image
      + '" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model + '">'
      grid += '</div>'
      grid += '<div class="vehicle-detail-box">'
      grid += '<h2 class="vehicle-name">'
      + data[0].inv_make + ' ' + data[0].inv_model + ' ' + 'Details'
      grid += '</h2>'
      grid += '<p class="vehicle-price">'
      + '<strong>Price:</strong>' + ' ' + '<strong>' + '$' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</strong>'
      grid += '</p>'
      grid += '<p class="description">' + '<strong>Description:</strong>'
      + ' ' + data[0].inv_description
      grid += '</p>'
      grid += '<p class="vehicle-year">'
      + '<strong>Year:</strong>' + ' ' + data[0].inv_year
      grid += '</p>'
      grid += '<p class="vehicle-color">'
      + '<strong>Color:</strong>' + ' ' + data[0].inv_color
      grid += '</p>'
      grid += '<p class="vehicle-miles">'
      + '<strong>Miles:</strong>' + ' ' + new Intl.NumberFormat('en-US').format(data[0].inv_miles)
      grid += '</p>'
      grid += '</div>'
      grid+= '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.dropDownClassification = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let list = '<select name="classification_id" id="classificationId" class="addNewCarOptions">'
  list += "<option>Choose a Classification</option>"
  data.rows.forEach((row) => {
    list += '<option value="' + row.classification_id + '"'
    if (classification_id != null &&
      row.classification_id == classification_id) {
      list += " selected "
    }
    list += ">" + row.classification_name + "</option>"
  })
  list += "</select>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
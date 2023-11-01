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
    data.forEach(vehicle => {
      grid = '<div class="details-content">'
      grid += '<div class="vehicle-img-box">'
      grid += '<img class="vehicle-detail-img" src="' + vehicle.inv_image
      + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model + '">'
      grid += '</div>'
      grid += '<div class="vehicle-detail-box">'
      grid += '<h2 class="vehicle-name">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + 'Details'
      grid += '</h2>'
      grid += '<p class="vehicle-price">'
      + '<strong>Price:</strong>' + ' ' + '<strong>' + '$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</strong>'
      grid += '</p>'
      grid += '<p class="description">' + '<strong>Description:</strong>'
      + ' ' + vehicle.inv_description
      grid += '</p>'
      grid += '<p class="vehicle-year">'
      + '<strong>Year:</strong>' + ' ' + vehicle.inv_year
      grid += '</p>'
      grid += '<p class="vehicle-color">'
      + '<strong>Color:</strong>' + ' ' + vehicle.inv_color
      grid += '</p>'
      grid += '<p class="vehicle-miles">'
      + '<strong>Miles:</strong>' + ' ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      grid += '</p>'
      grid += '</div>'
      grid+= '</div>'
    })
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildLogin = async function(){
  let grid
  grid = '<div class="login-div">'
  grid += '<form method="post">'
  grid += '<label for="email">' + 'Email:' + '</label>'
  grid += '<input type="text" id="email" name="account_email" required>'
  grid += '<label for="password">' + 'Password:' + '</label>'
  grid += '<input type="password" id="password" name="account_password" required>'
  grid += '<p class="form-note">' + 'Password requirements:' + '</p>'
  grid += '<ul class="password-reqs">'
  + '<li class="password-req">' + 'Minimum 12 characters' + '</li>'
  + '<li class="password-req">' + 'Include 1 capital letter' + '</li>'
  + '<li class="password-req">' + 'Include 1 number' + '</li>'
  + '<li class="password-req">' + 'Include 1 special character' + '</li>'
  grid += '</ul>'
  grid += '<button class="show-password-button" type="submit">' + 'Show Password' + '</button>'
  grid += '<button class="form-button" type="submit">' + 'LOGIN' + '</button>'
  grid += '</form>'
  grid += '<p class="change-form">' + 'No account?' + ' ' + '<a class="change-form-link" href="#">' + 'Sign-up' + '</a>' + '</p>'
  grid += '</div>'

  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
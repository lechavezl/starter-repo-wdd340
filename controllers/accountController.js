const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const grid = await utilities.buildLogin()
  res.render("account/login", {
    title: "Login",
    nav,
    grid,
  })
}

module.exports = { buildLogin }
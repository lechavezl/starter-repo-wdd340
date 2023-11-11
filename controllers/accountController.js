const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
// async function loginAccount(req, res) {
//   let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body

//   const logResult = await accountModel.loginAccount(
//     account_email,
//     account_password
//   )

//   console.log("Esto es lo que hay en logResult: " + logResult)

//   if (logResult) {
//     req.flash(
//       "notice",
//       `Congratulations, you\'re logged in ${account_email}.`
//     )
//     res.status(201).render("account/login", {
//       title: "Login",
//       nav,
//     })
//   } else {
//     req.flash("notice", "Sorry, the login process failed.")
//     res.status(501).render("account/login", {
//       title: "Login",
//       nav,
//     })
//   }
// }

module.exports = { buildLogin, buildRegister, registerAccount }
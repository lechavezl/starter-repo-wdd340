const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const invCont = require("./invController")
require("dotenv").config()

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

// Build and Display the Account Management view.
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
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
      errors: null,
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
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
 let nav = await utilities.getNav()
 const { account_email, account_password } = req.body
 const accountData = await accountModel.getAccountByEmail(account_email)
 if (!accountData) {
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
 return
 }
 try {
  if (await bcrypt.compare(account_password, accountData.account_password)) {
  delete accountData.account_password
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  return res.redirect("/account/")
  } else {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
 } catch (error) {
  return new Error('Access Forbidden')
 }
}

// Build and Display the Edit Account Data view.
async function buildEditAccountView (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("./account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Update account information
* *************************************** */

async function updateAccountData(req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const updateAccountData = await accountModel.updateAccountData(
    account_id,  
    account_firstname,
    account_lastname,
    account_email
  )

  const accountData = await accountModel.getAccountById(account_id)

  if (updateAccountData) {
    req.flash("notice", "Congratulations, your information has been updated.")
    if (await accountData.account_password) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      // req.flash("notice", "Congratulations, your information has been updated.")
      return res.redirect("/account/")
      }
  } else {
    req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
   })
  }
}

/* ****************************************
*  Change the account password
* *************************************** */
async function changeAccountPassword (req, res, next) {
  let nav = await utilities.getNav();
  // const account_id = parseInt(req.body.account_id)
  const {account_id, account_password} = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error changing the password.')
    res.status(500).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const changePasswordResult = await accountModel.changeAccountPassword(account_id, hashedPassword)

  if (changePasswordResult) {
    req.flash("notice", "Congratulations, your password has been changed.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, password coudn't be changed.")
    req.status(501).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }
}

async function logoutAccount (req, res, next) {
  let nav = await utilities.getNav()

  if (req.cookies.jwt) {
    res.clearCookie("jwt")
    req.flash("notice", "You logged out successfully")
    return res.redirect("/")
  }
}



module.exports = { buildLogin, buildRegister, buildAccountManagement, registerAccount, accountLogin, buildEditAccountView, updateAccountData, changeAccountPassword, logoutAccount }
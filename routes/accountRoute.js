const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

/* ****************************************
* Deliver Login View
************************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ****************************************
* Deliver Registration View
************************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* ****************************************
* Process Registration
************************************** */
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.loginAccount)
)

// Process the login attempt
// router.post(
//     "/login",
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

module.exports = router;
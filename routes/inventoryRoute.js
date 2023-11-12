// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validateData = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build product detail view by ID
router.get("/detail/:invtId", utilities.handleErrors(invController.buildProductViewDetailsById));

// Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Add new classification route
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

// Add new inventory route
router.get("/add-inventory", utilities.handleErrors(invController.buildNewInventoryVehicle));

//Process to add a new classification name
router.post(
    "/add-classification",
    validateData.addNewClassificationRules(),
    validateData.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClassificationProcess)
)

//Process to add a new vehicle to the inventory
router.post(
    "/add-inventory",
    validateData.addNewInventoryCarRules(),
    validateData.checkNewVehicleData,
    utilities.handleErrors(invController.addNewVehicleProcess)
)

// Route to the intentional error
router.get('/500Error', utilities.handleErrors(invController.generateIntentionalError))

module.exports = router;
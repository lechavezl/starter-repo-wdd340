// Needed Resources 
const express = require("express")
const invCont = require("../controllers/invController")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validateData = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build product detail view by ID
router.get("/detail/:invtId", utilities.handleErrors(invController.buildProductViewDetailsById));

// Inventory Management View
router.get("/",
    utilities.checkAuthAccountLogin,
    utilities.handleErrors(invController.buildManagementView));

// Add new classification route
router.get("/add-classification",
    utilities.checkAuthAccountLogin,
    utilities.handleErrors(invController.buildNewClassification));

// Add new inventory route
router.get("/add-inventory",
    utilities.checkAuthAccountLogin,
    utilities.handleErrors(invController.buildNewInventoryVehicle));

//* Get inventory for AJAX Route
//* Unit 5, Select inv item activity
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

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

//* Unit 5, update/delete inventory item
//Get the vehicle id in the magamement inventory view
//and display a sticky form to update The vehicle information. 
router.get("/edit/:edit_invId", utilities.handleErrors(invController.buildEditVehicleView))

//This route is to send to updated data to the database and make the cahnges.
router.post("/update/",
    validateData.addNewInventoryCarRules(),
    validateData.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

//Display the delete view to delete an item (vehicle) from the inventory (database)
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteVehicleView))

// Delete the vehicle and redirect the page
router.post("/delete/", utilities.handleErrors(invController.deleteVehicle))

// Route to the intentional error
router.get('/500Error', utilities.handleErrors(invController.generateIntentionalError))

module.exports = router;
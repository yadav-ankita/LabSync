const express = require("express");

const {
    createPurchase,
    getPurchases,
    getAvailableResources,
    getPurchase
} = require("../controllers/PurchaseController");

const router = express.Router();


// Record a new purchase
router.post("/", createPurchase);

// View complete Purchase Register
router.get("/", getPurchases);
router.get("/resources", getAvailableResources);

// View a particular purchase
router.get("/:id", getPurchase);


module.exports = router;
const express = require("express");

const {
    createPurchase,
    getPurchases,
    getPurchase
} = require("../controllers/PurchaseController");

const router = express.Router();


// Record a new purchase
router.post("/", createPurchase);

// View complete Purchase Register
router.get("/", getPurchases);

// View a particular purchase
router.get("/:id", getPurchase);


module.exports = router;
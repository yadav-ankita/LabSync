const express = require("express");

const {
    createPurchase,
    getPurchases,
    getAvailableResources,
    getPurchase,
    updatePurchase
} = require("../controllers/PurchaseController");

const uploadPurchaseBill = require("../middleware/purchaseBillUpload");
const router = express.Router();

router.post("/", uploadPurchaseBill.single("billFile"), createPurchase);
// Record a new purchase
router.post("/", createPurchase);

// View complete Purchase Register
router.get("/", getPurchases);
router.get("/resources", getAvailableResources);

// View a particular purchase
router.get("/:id", getPurchase);
//edit a particular purchase
router.patch(
    "/:id",
    uploadPurchaseBill.single("billFile"),
    updatePurchase
);

module.exports = router;
const express = require("express");
const authUser = require("../middleware/authUser");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createPurchase,
    getPurchases,
    getAvailableResources,
    getPurchase,
    updatePurchase
} = require("../controllers/PurchaseController");

const router = express.Router();

router.use(authUser, authorizeRoles("admin"));

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
    updatePurchase
);

module.exports = router;
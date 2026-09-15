const express = require("express");
const router = express.Router();

const authUser = require("../middleware/authUser");

const {
  getPendingMaintenance,
  updateMaintenanceApproval,
} = require("../controllers/HodController");

router.use(authUser);

router.get("/maintenance", getPendingMaintenance);
router.patch("/maintenance",updateMaintenanceApproval);

module.exports = router;
const express = require("express");
const router = express.Router();

const authUser = require("../middleware/authUser");

const {
  getPendingMaintenance,
  updateMaintenanceApproval,
  getPendingTransferRequests,
  updateTransferApproval,
} = require("../controllers/HodController");

router.use(authUser);

router.get("/maintenance", getPendingMaintenance);
router.patch("/maintenance",updateMaintenanceApproval);
router.get("/transferRequests", getPendingTransferRequests);
router.patch("/transferRequests/:id", updateTransferApproval);

module.exports = router;
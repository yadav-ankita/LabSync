const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser')
const {
    AddResourcesToLab,
    getAllLabResources,
    deleteLabResource,
    getAllComplaints,
    getAllComplaintsByLab,
    editComplaintStatus,
    editAdminProfile,
    getScrappedResources,
} = require("../controllers/AdminController");

const {
    getAllMaintenance,
    createMaintenance,
    updateMaintenance,
} = require("../controllers/MaintenanceController");

const {
    createResourceAssignmentRequest,
    getAllResourceAssignmentRequests,
} = require("../controllers/ResourceAssignmentRequestController");
const { getFundTypes, addFundType } = require("../controllers/FundTypeController");

router.use(authUser)
router.route("/profile").patch(editAdminProfile)
router.route("/fund-types").get(getFundTypes).post(addFundType)

router.route("/LabResource").get(getAllLabResources).post(AddResourcesToLab)
router.route("/LabResource/:id").delete(deleteLabResource)
router.route("/LabResource/scrapped").get(getScrappedResources);
router.route("/resource-assignment-request")
    .post(createResourceAssignmentRequest);
router.route("/resource-assignment-requests")
    .get(getAllResourceAssignmentRequests);
router.route("/complaints").get(getAllComplaints).patch(editComplaintStatus)
router.route("/complaints/lab/:labName").get(getAllComplaintsByLab);

router.route("/maintenance").get(getAllMaintenance).post(createMaintenance);

router.route("/maintenance/:id").patch(updateMaintenance);
module.exports = router;
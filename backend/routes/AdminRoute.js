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
    editAdminProfile
} = require("../controllers/AdminController");

router.use(authUser)
router.route("/profile").patch(editAdminProfile)

router.route("/LabResource").get(getAllLabResources).post(AddResourcesToLab)
router.route("/LabResource/:id").delete(deleteLabResource)
router.route("/complaints").get(getAllComplaints).patch(editComplaintStatus)
router.route("/complaints/lab/:labName").get(getAllComplaintsByLab);

module.exports = router;
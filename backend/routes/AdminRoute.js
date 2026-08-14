// const express = require('express')
// const router = express.Router();
// const {
//     AddResourcesToLab,
//     getAllLabResources,
//     getAllComplaints,
//     getAllComplaintsByLab,
//     editComplaintStatus
// } = require("../controllers/AdminController");

// router.route("/LabResource").get(getAllLabResources).post(AddResourcesToLab)
// router.route("/complaints").get(getAllComplaints).patch(editComplaintStatus)
// router.route("/complaints/lab_id").get(getAllComplaintsByLab);
// router.route

// module.exports = router; 
const express = require('express')
const router = express.Router();
//const verifyAdminToken = require('../middleware/verifyAdminToken')
const {
    AddResourcesToLab,
    getAllLabResources,
    getAllComplaints,
    getAllComplaintsByLab,
    editComplaintStatus
} = require("../controllers/AdminController");

router.route("/LabResource").get(getAllLabResources).post(AddResourcesToLab)
router.route("/complaints").get(getAllComplaints).patch(editComplaintStatus)
router.route("/complaints/lab/:labName").get(getAllComplaintsByLab);

module.exports = router;
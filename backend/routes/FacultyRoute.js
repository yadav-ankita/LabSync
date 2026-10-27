const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');
const {
    getProfileData,
    editProfileData,
    getAssignedLabResources,
    uploadLabManuals,
    createTransferRequest,
    getTransferRequests,
    deleteTransferRequest,
    getTransferOptions,
    respondToTransferRequest,
    getLabManuals,
    deleteLabManual,
    raiseComplaints,
    getLabComplaints,
    getResourceAssignmentRequests,
    respondToResourceAssignmentRequest,
      getFacultyScrappedResources,
 } = require("../controllers/FacultyController");

const { getFacultyMaintenance, getLabMaintenance } = require("../controllers/MaintenanceController");

router.use(authUser, authorizeRoles('faculty', 'labIncharge'));
router.route("/myprofile").get(getProfileData).patch(editProfileData);
router.route("/labResource").get(getAssignedLabResources);
router.route("/labManuals").get(getLabManuals).post(upload.single('pdfFile'), uploadLabManuals);
router.route("/labManuals/:id").delete(deleteLabManual);
router.route("/complaints").get(getLabComplaints).post(raiseComplaints);
router.route("/resourceAssignmentRequests")
    .get(getResourceAssignmentRequests);
router.get("/maintenance", getFacultyMaintenance);
router.get("/labMaintenance", getLabMaintenance);
router.route("/labResource/scrapped")
    .get(getFacultyScrappedResources);
router.route("/resourceAssignmentRequests/:id")
    .patch(respondToResourceAssignmentRequest);
router.route("/transferRequests")
    .get(getTransferRequests)
    .post(createTransferRequest);
router.route("/transferOptions")
    .get(getTransferOptions);
router.route("/transferRequests/:id")
    .patch(respondToTransferRequest)
    .delete(deleteTransferRequest);
module.exports = router; 

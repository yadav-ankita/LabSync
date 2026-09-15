const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser');
const upload = require('../middleware/multer');
const {
    getProfileData,
    editProfileData,
    getAssignedLabResources,
    uploadLabManuals,
    getLabManuals,
    deleteLabManual,
    raiseComplaints,
    getLabComplaints,
    getResourceAssignmentRequests,
    respondToResourceAssignmentRequest
 } = require("../controllers/FacultyController");

router.use(authUser);
router.route("/myprofile").get(getProfileData).patch(editProfileData);
router.route("/labResource").get(getAssignedLabResources);
router.route("/labManuals").get(getLabManuals).post(upload.single('pdfFile'), uploadLabManuals);
router.route("/labManuals/:id").delete(deleteLabManual);
router.route("/complaints").get(getLabComplaints).post(raiseComplaints);
router.route("/resourceAssignmentRequests")
    .get(getResourceAssignmentRequests);

router.route("/resourceAssignmentRequests/:id")
    .patch(respondToResourceAssignmentRequest);

module.exports = router; 

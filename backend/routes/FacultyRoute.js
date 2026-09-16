const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser');
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
router.route("/transferRequests")
    .get(getTransferRequests)
    .post(createTransferRequest);
router.route("/transferOptions")
    .get(getTransferOptions);
router.route("/transferRequests/:id")
    .patch(respondToTransferRequest)
    .delete(deleteTransferRequest);
module.exports = router; 

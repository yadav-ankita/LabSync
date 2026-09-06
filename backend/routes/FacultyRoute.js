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
    getComplaints
 } = require("../controllers/FacultyController");

router.use(authUser);
router.route("/myprofile").get(getProfileData).patch(editProfileData);
router.route("/labResource").get(getAssignedLabResources);
router.route("/labManuals").get(getLabManuals).post(upload.single('pdfFile'), uploadLabManuals);
router.route("/labManuals/:id").delete(deleteLabManual);
router.route("/complaints").get(getComplaints).post(raiseComplaints);

module.exports = router; 

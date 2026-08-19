const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser');
const {
    getProfileData,
    editProfileData,
    getAssignedLabResources,
    uploadLabManuals,
    raiseComplaints,
    getComplaints
 } = require("../controllers/FacultyController");

router.use(authUser);
router.route("/myprofile").get(getProfileData).patch(editProfileData);
router.route("/labResource").get(getAssignedLabResources);
router.route("/labManuals").post(uploadLabManuals);
router.route("/complaints").get(getComplaints).post(raiseComplaints);

module.exports = router; 

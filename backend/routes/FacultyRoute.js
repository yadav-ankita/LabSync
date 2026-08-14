const express = require('express')
const router = express.Router();
const {  
    getProfileData,
    editProfileData,
    getAssignedLabResources,
    uploadLabManuals,
    raiseComplaints,
    getComplaints
 } = require("../controllers/FacultyController");
router.route("/myprofile").get(getProfileData).patch(editProfileData);
router.route("/labResource").get(getAssignedLabResources);
router.route("/labManuals").post(uploadLabManuals);
router.route("/complaints").get(getComplaints).post(raiseComplaints);

module.exports = router; 

const express = require('express')
const router = express.Router();
const {
    emailCredentials,
    getFaculties,
    AddFaculties,
    deleteFaculty
} = require('../controllers/AdminFacultyController')

router.route("/").post(AddFaculties).get(getFaculties)
router.route("/credentials").post(emailCredentials);
router.route("/:id").delete(deleteFaculty);

module.exports = router; 

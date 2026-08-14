const express = require('express')
const router = express.Router();
const {
    emailCredentials,
    getFaculties,
    AddFaculties
} = require('../controllers/AdminFacultyController')

router.route("/").post(AddFaculties).get(getFaculties)
router.route("/credentials").post(emailCredentials);

module.exports = router; 

const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser')
const authorizeRoles = require('../middleware/authorizeRoles')
const {
    emailCredentials,
    getFaculties,
    AddFaculties,
    deleteFaculty
} = require('../controllers/AdminFacultyController')

router.use(authUser, authorizeRoles('admin'))
router.route("/").post(AddFaculties).get(getFaculties)
router.route("/credentials").post(emailCredentials);
router.route("/:id").delete(deleteFaculty);

module.exports = router; 

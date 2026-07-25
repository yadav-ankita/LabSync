const express = require('express')
const authenticateUser = require('../middleware/authUser')

const {
    login,
    raiseComplaint,
    getProfileData,
    getLabManuals,
    editProfile,
    getComplaints
} = require('../controller/student')
const router = express.Router();

router.post('/login', login);
router.use(authenticateUser)
router.post('/complaints', raiseComplaint);
router.get('/complaints', getComplaints);
router.get('/profile', getProfileData);
router.patch('/profile', editProfile);
router.get('/lab-manuals', getLabManuals);

module.exports = router
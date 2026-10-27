
const express = require("express");
const router = express.Router();

const {
    getStudentLabManuals,
    getStudentProfile,
    updateStudentProfile,
} = require("../controllers/studentController");

const authStudent = require("../middleware/authStudent");

router.use(authStudent);
router.get("/profile", getStudentProfile);
router.patch("/profile", updateStudentProfile);
router.get("/labManuals", getStudentLabManuals);

module.exports = router;

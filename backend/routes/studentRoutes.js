
const express = require("express");
const router = express.Router();

const {
    studentRegister,
    studentLogin,
    getStudentLabManuals,
    getStudentProfile,
    updateStudentProfile,
} = require("../controllers/studentController");

const authStudent = require("../middleware/authStudent");

router.post("/register", studentRegister);
router.post("/login", studentLogin);

router.get("/profile", authStudent, getStudentProfile);
router.patch("/profile", authStudent, updateStudentProfile);
router.get("/labManuals", authStudent, getStudentLabManuals);

module.exports = router;

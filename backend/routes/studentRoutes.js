const express = require("express");
const router = express.Router();

const {
    studentRegister,
    studentLogin,
} = require("../controllers/studentController");

router.post("/register", studentRegister);
router.post("/login", studentLogin);

module.exports = router;
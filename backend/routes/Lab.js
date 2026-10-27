const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser')
const authorizeRoles = require('../middleware/authorizeRoles')
const {
    getAllLabsName,
    AddLab
} = require("../controllers/Lab");
router.use(authUser)
router.get("/", getAllLabsName)
router.post("/", authorizeRoles("admin"), AddLab)
module.exports = router; 

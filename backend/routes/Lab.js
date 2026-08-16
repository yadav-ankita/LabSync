const express = require('express')
const router = express.Router();
const {
    getAllLabsName,
    AddLab
} = require("../controllers/Lab");
router.route("/").get(getAllLabsName).post(AddLab);
module.exports = router; 

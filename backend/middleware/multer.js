const multer = require("multer");
const path = require("path");

// Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // folder
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });
const storage = require("../middleware/cloudinaryStorage");
const upload = multer({
  storage
});
module.exports = upload;
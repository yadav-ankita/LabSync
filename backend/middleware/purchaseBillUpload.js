const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "purchase-bills"
);

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const uploadPurchaseBill = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(
        new Error("Only PDF, JPG, JPEG, and PNG bills are allowed.")
      );
    }
    cb(null, true);
  },
});

module.exports = uploadPurchaseBill;

const mongoose = require("mongoose");

const fundTypeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 12,
      match: /^[A-Z0-9]{2,12}$/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FundType", fundTypeSchema);
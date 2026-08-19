const mongoose = require("mongoose");
const FacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    lab_name: {
      type: String,
      required: true,
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Faculty", FacultySchema);
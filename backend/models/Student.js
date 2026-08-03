const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Please provide student ID"],
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Please provide student name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please provide password"],
    },

    batch: {
      type: Number,
      required: [true, "Please provide batch"],
    },

    admissionType: {
      type: String,
      enum: ["Regular", "D2D"],
      required: [true, "Please provide admission type"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", StudentSchema);
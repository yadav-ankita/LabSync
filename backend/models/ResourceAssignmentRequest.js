const mongoose = require("mongoose");

const ResourceAssignmentRequestSchema = new mongoose.Schema(
  {
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },

    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },

    labIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["Hardware", "Software"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ResourceAssignmentRequest",
  ResourceAssignmentRequestSchema
);
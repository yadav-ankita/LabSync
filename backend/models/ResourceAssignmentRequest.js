
const mongoose = require("mongoose");

const ResourceAssignmentRequestSchema = new mongoose.Schema(
  {
    // Optional for requests containing assets from multiple purchases.
    // Retained for compatibility with older requests.
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      default: null,
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

    // The quantity is determined by the number of selected assets.
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    // Exact existing assets selected for assignment.
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LabResource",
      },
    ],

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

module.exports =
  mongoose.models.ResourceAssignmentRequest ||
  mongoose.model(
    "ResourceAssignmentRequest",
    ResourceAssignmentRequestSchema
  );

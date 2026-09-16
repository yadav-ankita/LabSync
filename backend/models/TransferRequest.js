const mongoose = require("mongoose");

const transferRequestSchema = new mongoose.Schema(
  {
    assets: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabResource",
    required: true,
  },
],

    fromLab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },

    toLab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    otherIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    requesterApproval: {
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      decidedAt: {
        type: Date,
        default: null,
      },
    },

    otherInchargeApproval: {
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      decidedAt: {
        type: Date,
        default: null,
      },
    },

    hodApproval: {
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      decidedAt: {
        type: Date,
        default: null,
      },
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Approved",
        "Rejected",
        "Transferred",
      ],
      default: "Pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransferRequest", transferRequestSchema);
const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      unique: true,
    },

    hodApprovalStatus: {
      type: String,
      enum: ["Not Required", "Pending", "Approved", "Rejected"],
      default: "Not Required",
    },

    maintenanceStatus: {
  type: String,
  enum: [
    "Not Started",
    "In Progress",
    "Completed",
  ],
  default: "Not Started",
},

    hodApprovalDate: {
      type: Date,
    },

    hodRemarks: {
      type: String,
      trim: true,
    },

    forwardingType: {
      type: String,
      enum: ["None", "Department", "External Agency"],
      default: "None",
    },

    forwardedTo: {
      type: String,
      trim: true,
    },

    dateOfForwarding: {
      type: Date,
    },

    requisitionNumber: {
      type: String,
      trim: true,
    },

    externalAgencyName: {
      type: String,
      trim: true,
    },

    maintenanceSite: {
      type: String,
      trim: true,
    },

    resolvedBy: {
      type: String,
      trim: true,
    },

    resolutionDate: {
      type: Date,
    },

    resolutionRemarks: {
      type: String,
      trim: true,
    },

    finalRemarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);

const mongoose = require('mongoose');

const LabResourceSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    originalAssetId: {
      type: String,
      default: null,
      trim: true,
    },

    labName: {
      type: String,
      default: 'Not Assigned',
      trim: true,
    },

    previousLabName: {
      type: String,
      trim: true,
      default: null,
    },

    labCode: {
      type: String,
      default: null,
      trim: true,
    },

    resourceName: {
      type: String,
      required: true,
      trim: true,
    },

    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase',
      required: true,
    },
        configuration: {
      type: Map,
      of: String,
      default: {},
    },

    configurationHistory: [
      {
        remarks: {
          type: String,
          trim: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changes: {
          type: Map,
          of: String,
          default: {},
        },
      },
    ],
    resourceCode: {
      type: String,
      required: true,
      trim: true,
    },

    serialNumber: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: [
        'Available',
        'In Use',
        'Maintenance',
        'Faulty',
        'Scrapped',
      ],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.LabResource ||
  mongoose.model('LabResource', LabResourceSchema);

const mongoose = require('mongoose');

const LabResourceSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    labName: {
      type: String,
      required: true,
      trim: true,
    },
    labCode: {
      type: String,
      required: true,
      trim: true,
    },
    resourceName: {
      type: String,
      required: true,
      trim: true,
    },
    purchase:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    resourceCode: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ['Hardware', 'Software'],
      required: true,
    },
    serialNumber: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Available', 'In Use', 'Maintenance', 'Faulty'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LabResource', LabResourceSchema);
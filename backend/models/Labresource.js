const mongoose = require('mongoose')

const LabResourceSchema = new mongoose.Schema(
    {
        // System-generated, e.g. "BVM/HW/F206/RCH/01" — see utils/generateAssetId.js
        assetId: {
            type: String,
            required: true,
            unique: true,
        },
        labName: {
            type: String,
            required: [true, 'Please provide the lab name'],
            trim: true,
        },
        // Short code derived from labName, e.g. "F206 Lab" -> "F206"
        labCode: {
            type: String,
            required: true,
        },
        resourceName: {
            type: String,
            required: [true, 'Please provide the resource name'],
            trim: true,
        },
        // Short code derived from resourceName, e.g. "Revolving Chair" -> "RCH"
        resourceCode: {
            type: String,
            required: true,
        },
        resourceType: {
            type: String,
            enum: ['Hardware', 'Software'],
            required: [true, 'Please specify the resource type'],
        },
        // Position of this unit within its (labCode, resourceCode) series —
        // this is the trailing number in the assetId.
        serialNumber: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Available', 'Borrowed', 'Under Maintenance'],
            default: 'Available',
        },
       
    },
    { timestamps: true }
)

module.exports = mongoose.model('LabResource', LabResourceSchema)
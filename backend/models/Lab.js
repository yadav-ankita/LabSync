const mongoose = require('mongoose')

const LabSchema = new mongoose.Schema(
    {
        LabName: {
            type: String,
            required: [true, 'Please provide the lab name'],
            unique: true,
            trim: true,
        },
        NumResources: {
            type: Number,
            default: 0,
        },
        AssignFaculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            default: null,
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model('Lab', LabSchema)
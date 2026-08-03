const mongoose = require('mongoose')

const ComplaintSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        labName: {
            type: String,
            required: [true, 'Please provide the lab name'],
        },
        issueType: {
            type: String,
            enum: ['Hardware', 'Software'],
            required: [true, 'Please specify the issue type'],
        },
        resourceId: {
            type: String,
            required: [true, 'Please provide the resource / PC ID'],
        },
        description: {
            type: String,
            required: [true, 'Please describe the issue'],
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Complaint', ComplaintSchema)
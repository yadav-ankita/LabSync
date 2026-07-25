const mongoose = require('mongoose')

const LabManualSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: [true, 'Please provide the subject name'],
        },
        labName: {
            type: String,
            required: [true, 'Please provide the lab name'],
        },
        title: {
            type: String,
            required: [true, 'Please provide a manual title'],
        },
        fileType: {
            type: String,
            enum: ['PDF', 'DOCX'],
            default: 'PDF',
        },
        fileUrl: {
            type: String,
            required: [true, 'Please provide the file location'],
        },
        size: {
            type: String,
        },
        // used to filter which manuals a student sees once they set their semester
        semester: {
            type: String,
            required: [true, 'Please provide the semester this manual belongs to'],
        },
        branch: {
            type: String,
            required: [true, 'Please provide the branch this manual belongs to'],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('LabManual', LabManualSchema)
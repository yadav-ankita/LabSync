const mongoose = require('mongoose')

const LabManualSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: [true, 'Please provide the subject name'],
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
        // used to filter which manuals a student sees once they set their semester
        semester: {
            type: String,
            required: [true, 'Please provide the semester this manual belongs to'],
        },
        branch: {
            type: String,
            default: '',
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            required: true,
        },
        labName: {
            type: String,
            default: '',
        },
        originalName: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('LabManual', LabManualSchema)
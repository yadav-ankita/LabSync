const mongoose = require("mongoose");

const StudentImportSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        importedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["processing", "completed"],
            default: "processing",
        },
        summary: {
            total: { type: Number, default: 0 },
            created: { type: Number, default: 0 },
            duplicates: { type: Number, default: 0 },
            validationFailures: { type: Number, default: 0 },
            emailFailures: { type: Number, default: 0 },
        },
        rows: [
            {
                rowNumber: Number,
                email: String,
                phone: String,
                status: String,
                messages: [String],
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("StudentImport", StudentImportSchema);

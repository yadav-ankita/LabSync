const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phone: {
            type: String,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
            default:"Computer Engineering"
        },
        semester: {
            type: String,
            enum: ["", "1", "2", "3", "4", "5", "6", "7", "8"],
            default: "",
            trim: true,
        },
        role: {
            type: String,
            enum: ['student', 'admin','faculty','hod','labIncharge'],
            default: 'nothing'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
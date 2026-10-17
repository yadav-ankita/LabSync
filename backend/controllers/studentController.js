
const User = require("../models/User");
const LabManual = require("../models/LabManual");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student Registration
// Uses the shared users collection.
exports.studentRegister = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields.",
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            department,
            role: "student",
        });

        return res.status(201).json({
            success: true,
            message: "Student registered successfully.",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                department: student.department,
                role: student.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Student Login
exports.studentLogin = async (req, res) => {
    try {
        // Your existing users collection uses email, not studentId.
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password.",
            });
        }

        const student = await User.findOne({
            email: email.trim().toLowerCase(),
            role: "student",
        });

        if (
            !student ||
            !(await bcrypt.compare(password, student.password))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid student credentials.",
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                userId: student._id,
                role: "student",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                department: student.department,
                role: student.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Lab Manuals for Students (read-only endpoint)
exports.getStudentLabManuals = async (req, res, next) => {
    try {
        const { semester } = req.query;
        const filter = {};

        if (semester) {
            if (!/^[1-8]$/.test(String(semester))) {
                return res.status(400).json({
                    success: false,
                    message: "Semester must be between 1 and 8.",
                });
            }

            filter.semester = String(semester);
        }

        const manuals = await LabManual.find(filter)
            .select(
                "title subject semester fileType fileUrl createdAt updatedAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: manuals.length,
            manuals,
        });
    } catch (error) {
        next(error);
    }
};

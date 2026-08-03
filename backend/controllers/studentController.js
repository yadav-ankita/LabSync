const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Student
exports.studentRegister = async (req, res) => {
    try {
        const {
            studentId,
            name,
            email,
            password,
            batch,
            admissionType
        } = req.body;

        if (
            !studentId ||
            !name ||
            !email ||
            !password ||
            !batch ||
            !admissionType
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields.",
            });
        }

        const existingStudent = await Student.findOne({
            $or: [{ studentId }, { email }],
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            studentId,
            name,
            email,
            password: hashedPassword,
            batch,
            admissionType,
        });

        res.status(201).json({
            success: true,
            message: "Student registered successfully.",
            student,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Login Student
exports.studentLogin = async (req, res) => {
    try {
        const { studentId, password } = req.body;

        if (!studentId || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide Student ID and Password.",
            });
        }

        const student = await Student.findOne({ studentId });

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid Student ID or Password.",
            });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Student ID or Password.",
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                studentId: student.studentId,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME,
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            student: {
                id: student._id,
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                batch: student.batch,
                admissionType: student.admissionType,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
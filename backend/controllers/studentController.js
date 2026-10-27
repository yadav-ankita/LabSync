
const User = require("../models/User");
const Faculty = require("../models/Faculty_model");
const LabManual = require("../models/LabManual");
const { bcrypt } = require("../utils/passwords");

const getStudentProfile = async (req, res, next) => {
    try {
        const student = await User.findOne({
            _id: req.user.userId,
            role: "student",
        }).select("-__v");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student account not found.",
            });
        }

        return res.status(200).json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                department: student.department,
                semester: student.semester || "",
                role: student.role,
            },
        });
    } catch (error) {
        return next(error);
    }
};

const updateStudentProfile = async (req, res, next) => {
    try {
        const { name, email, department, semester, password } = req.body;
        const student = await User.findOne({
            _id: req.user.userId,
            role: "student",
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student account not found.",
            });
        }

        if (name !== undefined) {
            const normalizedName = name.trim();
            if (!normalizedName) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty.",
                });
            }
            student.name = normalizedName;
        }

        if (email !== undefined) {
            const normalizedEmail = email.trim().toLowerCase();
            if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid email address.",
                });
            }

            const existingStudent = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: student._id },
            });
            const existingFaculty = await Faculty.findOne({ email: normalizedEmail });
            if (existingStudent || existingFaculty) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists.",
                });
            }
            student.email = normalizedEmail;
        }

        if (department !== undefined) {
            const normalizedDepartment = department.trim();
            if (!normalizedDepartment) {
                return res.status(400).json({
                    success: false,
                    message: "Branch cannot be empty.",
                });
            }
            student.department = normalizedDepartment;
        }

        if (semester !== undefined) {
            const normalizedSemester = String(semester).trim();
            if (!/^[1-8]$/.test(normalizedSemester)) {
                return res.status(400).json({
                    success: false,
                    message: "Semester must be between 1 and 8.",
                });
            }
            student.semester = normalizedSemester;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters.",
                });
            }
            student.password = await bcrypt.hash(password, 12);
        }

        await student.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                department: student.department,
                semester: student.semester || "",
                role: student.role,
            },
        });
    } catch (error) {
        return next(error);
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

exports.getStudentProfile = getStudentProfile;
exports.updateStudentProfile = updateStudentProfile;

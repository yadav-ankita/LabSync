
require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthenticatedError } = require("../error");

const authStudent = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(
            new UnauthenticatedError("Authentication Invalid")
        );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next(
            new UnauthenticatedError("Authentication Invalid")
        );
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Common login uses userId, not id or studentId.
        const userId = payload.userId || payload.id || payload.studentId;

        if (!userId) {
            return next(
                new UnauthenticatedError("Invalid student token")
            );
        }

        // Verify the actual database role; don't trust the client.
        const student = await User.findOne({
            _id: userId,
            role: "student",
        }).select("_id name email role");

        if (!student) {
            return next(
                new UnauthenticatedError(
                    "Student account not found or unauthorized"
                )
            );
        }

        req.user = {
            userId: student._id,
            id: student._id,
            name: student.name,
            email: student.email,
            role: student.role,
        };

        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            return next(
                new UnauthenticatedError("Authentication Invalid")
            );
        }

        return next(error);
    }
};

module.exports = authStudent;

require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Faculty = require("../models/Faculty_model");
const { UnauthenticatedError } = require("../error");

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : "";

    if (!token) {
        return next(new UnauthenticatedError("Authentication required."));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.userId || payload.id || payload.studentId;

        if (!userId) {
            return next(new UnauthenticatedError("Authentication required."));
        }

        const user = await User.findById(userId).select("_id name email role phone");
        if (user) {
            req.user = {
                userId: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
            return next();
        }

        const faculty = await Faculty.findById(userId).select("_id name email lab_name lab");
        if (!faculty) {
            return next(new UnauthenticatedError("Account not found."));
        }

        req.user = {
            userId: faculty._id,
            id: faculty._id,
            name: faculty.name,
            email: faculty.email,
            lab_name: faculty.lab_name,
            lab: faculty.lab,
            role: faculty.lab_name || faculty.lab ? "labIncharge" : "faculty",
        };
        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "CastError") {
            return next(new UnauthenticatedError("Authentication required."));
        }

        return next(error);
    }
};

module.exports = authenticationMiddleware;

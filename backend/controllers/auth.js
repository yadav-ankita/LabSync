require("dotenv").config();

const Faculty = require("../models/Faculty_model");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../error");
const { bcrypt, comparePassword, isBcryptHash } = require("../utils/passwords");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            throw new BadRequestError("Please provide email and password.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        const faculty = user ? null : await Faculty.findOne({ email: normalizedEmail });
        const account = user || faculty;

        if (!account || !(await comparePassword(password, account.password))) {
            throw new UnauthenticatedError("Invalid email or password.");
        }

        const role = user
            ? user.role
            : faculty.lab_name || faculty.lab
              ? "labIncharge"
              : "faculty";
        const allowedRoles = ["student", "admin", "faculty", "labIncharge", "hod"];

        if (!allowedRoles.includes(role)) {
            throw new UnauthenticatedError("This account does not have an active role.");
        }

        if (!isBcryptHash(account.password)) {
            account.password = await bcrypt.hash(password, 12);
            await account.save();
        }

        const token = jwt.sign(
            { userId: account._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        );
        const authenticatedUser = {
            _id: account._id,
            id: account._id,
            name: account.name,
            email: account.email,
            role,
            ...(faculty ? { lab_name: faculty.lab_name, lab: faculty.lab } : {}),
        };

        return res.status(StatusCodes.OK).json({
            message: "Authentication successful.",
            token,
            user: authenticatedUser,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { login };

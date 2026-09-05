require('dotenv').config()
const Faculty=require("../models/Faculty_model")
const User=require("../models/User")
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')

const register = async (req, res, next) => {
    const { name,email,password,phone,role } = req.body;
    try {
        if (!name || !email || !password || !phone || !role) {
            throw new BadRequestError("Please provide name, email, and password, phone, role");
        }
        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestError("Please provide a valid email address");
        }
        // Password strength validation
        const passwordRegex =
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$$/;

        if (!passwordRegex.test(password)) {
            throw new BadRequestError(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
            );
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError("Email already registered");
        }
        const user = await User.create({ name, email, password,role });
        const token = jwt.sign(
            { userId: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )
        res.status(StatusCodes.CREATED).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        next(error)
    }
}
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new BadRequestError("Please Provide email and Password")
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        const facultyRecord = user || await Faculty.findOne({ email: normalizedEmail });
        if (!facultyRecord) {
            throw new NotFoundError("User not found!")
        }
        const passwordMatches = user
            ? user.password === password
            : facultyRecord.password === password;
        if (!passwordMatches) {
            throw new UnauthenticatedError('Invalid  Credentials')
        }
        const token = jwt.sign(
            {
                userId: facultyRecord._id,
                username: facultyRecord.name,
                email: facultyRecord.email,
                role: user?.role || 'faculty',
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )
        const faculty = {
            _id: facultyRecord._id,
            name: facultyRecord.name,
            email: facultyRecord.email,
            lab_name: facultyRecord.lab_name,
            password: facultyRecord.password,
            role: user?.role || 'faculty',
        }
        res.status(StatusCodes.OK).json(
            {
                message: "Authentication successful",
                token: token,
                faculty,
            }
        )
    } catch (error) {
        next(error);
    }
}
module.exports = {  login,register  };
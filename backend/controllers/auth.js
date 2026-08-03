require('dotenv').config()
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            throw new BadRequestError("Please provide name, email, and password");
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
        const user = await User.create({ username, email, password });
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )
        res.status(StatusCodes.CREATED).json({ user: { username: user.username, role: user.role }, token });
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
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found!")
        }
        if (user.password !== password) {
            throw new UnauthenticatedError('Invalid  Credentials of password')
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )
        res.status(StatusCodes.OK).json(
            {
                message: "Authentication successful",
                token: token,
                user: {
                    username: user.username,
                    role: user.role
                }
            }
        )
    } catch (error) {
        next(error);
    }
}
module.exports = { register, login };
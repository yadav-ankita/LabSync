require('dotenv').config()
const Faculty = require("../models/Faculty_model")
const LabResource = require("../models/LabResource")
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')

const getProfileData = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.user.userId).select('-__v');

        if (!faculty) {
            throw new NotFoundError('Faculty not found');
        }

        const responseFaculty = {
            _id: faculty._id,
            id: faculty._id,
            name: faculty.name,
            faculty_name: faculty.name,
            email: faculty.email,
            lab_name: faculty.lab_name,
            password: faculty.password,
            createdAt: faculty.createdAt,
        };

        res.status(StatusCodes.OK).json({ faculty: responseFaculty });
    } catch (error) {
        next(error);
    }
}

const editProfileData = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const faculty = await Faculty.findById(req.user.userId);

        if (!faculty) {
            throw new NotFoundError('Faculty not found');
        }

        if (name) faculty.name = name.trim();
        if (email) {
            const normalizedEmail = email.toLowerCase().trim();
            const existing = await Faculty.findOne({ email: normalizedEmail, _id: { $ne: faculty._id } });
            if (existing) {
                throw new BadRequestError('A faculty with this email already exists');
            }
            faculty.email = normalizedEmail;
        }
        if (password && password.trim()) {
            faculty.password = password.trim();
        }

        await faculty.save();

        const responseFaculty = {
            _id: faculty._id,
            id: faculty._id,
            name: faculty.name,
            faculty_name: faculty.name,
            email: faculty.email,
            lab_name: faculty.lab_name,
            password: faculty.password,
            createdAt: faculty.createdAt,
        };

        res.status(StatusCodes.OK).json({ faculty: responseFaculty, message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
}

const getAssignedLabResources = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.user.userId);

        if (!faculty) {
            throw new NotFoundError('Faculty not found');
        }

        const resources = await LabResource.find({ labName: faculty.lab_name }).sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json({
            labName: faculty.lab_name,
            resources,
            count: resources.length,
        });
    } catch (error) {
        next(error);
    }
}

const uploadLabManuals = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const raiseComplaints = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const getComplaints = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
module.exports = {
    getProfileData,
    editProfileData,
    getAssignedLabResources,
    uploadLabManuals,
    raiseComplaints,
    getComplaints
};
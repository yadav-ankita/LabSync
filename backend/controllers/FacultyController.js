require('dotenv').config()
const Lab = require("../models/Lab");
const Purchase = require("../models/Purchase_model");
const ResourceAssignmentRequest = require("../models/ResourceAssignmentRequest");
const generateAssetId = require("../utils/generateAssetId"); 
const Faculty = require("../models/Faculty_model")
const LabResource = require("../models/LabResource")
const LabManual = require("../models/LabManual")
const fs = require("fs/promises")
const path = require("path")
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
const getResourceAssignmentRequests = async (req, res, next) => {
    try {
        const requests = await ResourceAssignmentRequest.find({
    labIncharge: req.user.userId,
    status: "Pending",
})
    .populate("purchase")
    .populate({
        path: "lab",
        populate: {
            path: "AssignFaculty",
            select: "name email",
        },
    })
    .sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json({
            requests,
            count: requests.length,
        });
    } catch (error) {
        next(error);
    }
};


const respondToResourceAssignmentRequest = async (req, res, next) => {
    try {
        const { status, rejectionReason } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            throw new BadRequestError(
                "Status must be Approved or Rejected"
            );
        }

        const request = await ResourceAssignmentRequest.findById(
            req.params.id
        );

        if (!request) {
            throw new NotFoundError(
                "Resource assignment request not found"
            );
        }

        if (request.labIncharge.toString() !== req.user.userId) {
            throw new UnauthenticatedError(
                "You are not authorized to respond to this request"
            );
        }

        if (request.status !== "Pending") {
            throw new BadRequestError(
                "This request has already been processed"
            );
        }

        if (status === "Rejected") {
            request.status = "Rejected";
            request.rejectionReason = rejectionReason?.trim() || null;

            await request.save();

            return res.status(StatusCodes.OK).json({
                message: "Resource assignment request rejected",
                request,
            });
        }

        const purchase = await Purchase.findById(request.purchase);

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }

        const lab = await Lab.findById(request.lab);

        if (!lab) {
            throw new NotFoundError("Lab not found");
        }

        const totalPurchased = await Purchase.aggregate([
            {
                $match: {
                    particulars: purchase.particulars,
                },
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" },
                },
            },
        ]);

        const totalQuantity =
            totalPurchased.length > 0
                ? totalPurchased[0].totalQuantity
                : 0;

        const assignedQuantity = await LabResource.countDocuments({
            resourceName: purchase.particulars,
        });

        const approvedResources = [];

        for (let i = 0; i < request.quantity; i++) {
            const {
                assetId,
                labCode,
                resourceCode,
                serialNumber,
            } = await generateAssetId({
                labName: lab.LabName,
                resourceName: purchase.particulars,
                resourceType: request.resourceType,
            });

            const resource = await LabResource.create({
                assetId,
                labName: lab.LabName,
                labCode,
                resourceName: purchase.particulars,
                resourceCode,
                resourceType: request.resourceType,
                serialNumber,
                purchase: purchase._id,
            });

            approvedResources.push(resource);
        }

        const totalResources = await LabResource.countDocuments({
            labName: lab.LabName,
        });

        lab.NumResources = totalResources;
        await lab.save();

        request.status = "Approved";
        request.rejectionReason = null;
        await request.save();

        res.status(StatusCodes.OK).json({
            message: "Resource assignment request approved",
            request,
            resources: approvedResources,
            count: approvedResources.length,
            remainingQuantity:
                totalQuantity - assignedQuantity - approvedResources.length,
        });
    } catch (error) {
        next(error);
    }
};
const uploadLabManuals = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError('Please upload a PDF file.');
        }

        const { title, subject, semester, branch = '' } = req.body;
        if (!title?.trim() || !subject?.trim() || !semester) {
            await fs.unlink(req.file.path).catch(() => {});
            throw new BadRequestError('Title, subject, and semester are required.');
        }

        const faculty = await Faculty.findById(req.user.userId);
        if (!faculty) {
            await fs.unlink(req.file.path).catch(() => {});
            throw new NotFoundError('Faculty not found');
        }

        const manual = await LabManual.create({
            title: title.trim(),
            subject: subject.trim(),
            semester: String(semester),
            branch: branch.trim(),
            faculty: faculty._id,
            labName: faculty.lab_name || '',
            originalName: req.file.originalname,
            filename: req.file.filename,
            fileType: 'PDF',
            fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        });

        res.status(StatusCodes.CREATED).json({ message: 'Manual uploaded successfully', manual });
    } catch (error) {
        next(error);
    }
}

const getLabManuals = async (req, res, next) => {
    try {
        const manuals = await LabManual.find({ faculty: req.user.userId }).sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ manuals });
    } catch (error) {
        next(error);
    }
}

const deleteLabManual = async (req, res, next) => {
    try {
        const manual = await LabManual.findOne({ _id: req.params.id, faculty: req.user.userId });
        if (!manual) {
            throw new NotFoundError('Manual not found');
        }

        await LabManual.deleteOne({ _id: manual._id });
        await fs.unlink(path.join(__dirname, '..', 'uploads', manual.filename)).catch(() => {});
        res.status(StatusCodes.OK).json({ message: 'Manual deleted successfully' });
    } catch (error) {
        next(error);
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
    getResourceAssignmentRequests,
    respondToResourceAssignmentRequest,
    uploadLabManuals,
    getLabManuals,
    deleteLabManual,
    raiseComplaints,
    getComplaints
};
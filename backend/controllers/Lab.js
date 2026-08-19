require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')
const Lab=require("../models/Lab")
const LabResource = require('../models/LabResource')

const AddLab = async (req, res, next) => {
    try {
        const { LabName } = req.body;

        if (!LabName || !LabName.trim()) {
            throw new BadRequestError("Please provide lab name");
        }

        const existingLab = await Lab.findOne({
            LabName: LabName.trim()
        });

        if (existingLab) {
            throw new BadRequestError("Lab already exists");
        }

        const lab = await Lab.create({
            LabName: LabName.trim(),
            NumResources: 0
        });

        res.status(StatusCodes.CREATED).json({
            lab
        });

    } catch (error) {
        next(error);
    }
};

const getAllLabsName = async (req, res, next) => {
    try {
        const labs = await Lab.find({}).populate('AssignFaculty', 'name email').sort('-createdAt');
        const enrichedLabs = await Promise.all(labs.map(async (lab) => {
            const resourceCount = await LabResource.countDocuments({ labName: lab.LabName.trim() });
            return {
                ...lab.toObject(),
                NumResources: resourceCount,
                facultyName: lab.AssignFaculty ? lab.AssignFaculty.name : 'Not Yet Assigned',
            };
        }));

        res.status(StatusCodes.OK).json({
            labs: enrichedLabs
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
   getAllLabsName,
   AddLab
};
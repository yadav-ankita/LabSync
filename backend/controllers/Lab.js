require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')
const Lab=require("../models/Lab")
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
        const labNames=await Lab.find();
        res.status(StatusCodes.OK).json(
           {
               labs:labNames
           }
        )
    } catch (error) {
        next(error)
    }
}
module.exports = {
   getAllLabsName,
   AddLab
};
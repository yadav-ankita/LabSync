require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')
const LabResource = require('../models/LabResource')
const Purchase=require('../models/Purchase_model')
const Complaint = require('../models/complaint')
const generateAssetId = require('../utils/generateAssetId')

// POST /admin/LabResource
// body: { labName, resourceName, resourceType, quantity }
// quantity is optional (default 1) — lets the admin add several units of
// the same resource to the same lab in one request. Each unit gets its own
// sequential, system-generated assetId, e.g. adding 3 "Revolving Chair"
// units to "F206 Lab" produces BVM/HW/F206/RCH/01, .../02, .../03.
const AddResourcesToLab = async (req, res, next) => {
    try {
        const { purchaseId, labName, resourceType, quantity = 1 } = req.body

        // Validate required fields
        if (!purchaseId || !labName || !resourceType) {
            throw new BadRequestError(
                'Please provide purchaseId, labName and resourceType'
            )
        }

        if (!['Hardware', 'Software'].includes(resourceType)) {
            throw new BadRequestError(
                "resourceType must be 'Hardware' or 'Software'"
            )
        }

        const qty = Number(quantity)

        if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
            throw new BadRequestError(
                'quantity must be a whole number between 1 and 100'
            )
        }

        // Find the selected purchase
        const purchase = await Purchase.findById(purchaseId)

        if (!purchase) {
            throw new NotFoundError('Purchase not found')
        }
        
        // Find total quantity purchased for this resource
const totalPurchased = await Purchase.aggregate([
    {
        $match: {
            particulars: purchase.particulars
        }
    },
    {
        $group: {
            _id: null,
            totalQuantity: { $sum: "$quantity" }
        }
    }
])

const totalQuantity =
    totalPurchased.length > 0
        ? totalPurchased[0].totalQuantity
        : 0


// Count all units of this resource already assigned
const assignedQuantity =
    await LabResource.countDocuments({
        resourceName: purchase.particulars
    })


// Calculate common remaining quantity
const remainingQuantity =
    totalQuantity - assignedQuantity

        // Prevent assigning more than purchased quantity
        if (qty > remainingQuantity) {
            throw new BadRequestError(
                `Only ${remainingQuantity} resource(s) are available for assignment`
            )
        }

        const createdResources = []

        // Create individual resource records
        for (let i = 0; i < qty; i++) {

            const { assetId, labCode, resourceCode, serialNumber } =
                await generateAssetId({
                    labName,
                    resourceName: purchase.particulars,
                    resourceType,
                })

            const resource = await LabResource.create({
                assetId,
                labName,
                labCode,
                resourceName: purchase.particulars,
                resourceCode,
                resourceType,
                serialNumber,
                purchase: purchaseId,
            })

            createdResources.push(resource)
        }

        // Update total resource count of the lab
        const lab = await require('../models/Lab')
            .findOne({ LabName: labName.trim() })

        if (lab) {
            const totalResources =
                await LabResource.countDocuments({
                    labName: labName.trim()
                })

            lab.NumResources = totalResources
            await lab.save()
        }

        res.status(StatusCodes.CREATED).json({
            resources: createdResources,
            count: createdResources.length,
            purchaseId: purchase._id,
            remainingQuantity:
            remainingQuantity - createdResources.length,
        })

    } catch (error) {
        next(error)
    }
}

// GET /admin/LabResource
// optional query: ?labName=F206 Lab&resourceType=Hardware&status=Available
const getAllLabResources = async (req, res, next) => {
    try {
        const { labName, resourceType, status } = req.query
        const filter = {}
        if (labName) filter.labName = labName
        if (resourceType) filter.resourceType = resourceType
        if (status) filter.status = status
       
        const resources = await LabResource.find(filter).sort('createdAt')
        res.status(StatusCodes.OK).json({ resources, count: resources.length })
    } catch (error) {
        next(error)
    }
}

// GET /admin/complaints
const getAllComplaints = async (req, res, next) => {
    try {
        const complaints = await Complaint.find({})
            .populate('faculty', 'name email lab_no')
            .sort('-createdAt')
        res.status(StatusCodes.OK).json({ complaints, count: complaints.length })
    } catch (error) {
        next(error)
    }
}

// GET /admin/complaints/lab/:labName
const getAllComplaintsByLab = async (req, res, next) => {
    try {
        const { labName } = req.params
        if (!labName) {
            throw new BadRequestError('Please provide a lab name')
        }

        const complaints = await Complaint.find({ labName })
            .populate('faculty', 'name email lab_no')
            .sort('-createdAt')
        res.status(StatusCodes.OK).json({ complaints, count: complaints.length })
    } catch (error) {
        next(error)
    }
}

// PATCH /admin/complaints
// body: { complaintId, status }
const editComplaintStatus = async (req, res, next) => {
    try {
        const { complaintId, status } = req.body
        const allowedStatuses = ['Pending', 'In Progress', 'Resolved']

        if (!complaintId || !status) {
            throw new BadRequestError('Please provide complaintId and status')
        }
        if (!allowedStatuses.includes(status)) {
            throw new BadRequestError(`status must be one of: ${allowedStatuses.join(', ')}`)
        }

        const complaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { status },
            { new: true, runValidators: true }
        )

        if (!complaint) {
            throw new NotFoundError('Complaint not found')
        }

        res.status(StatusCodes.OK).json({ complaint })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    AddResourcesToLab,
    getAllLabResources,
    getAllComplaints,
    getAllComplaintsByLab,
    editComplaintStatus
};
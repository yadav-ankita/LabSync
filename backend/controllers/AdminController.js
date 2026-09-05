require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')
const LabResource = require('../models/LabResource')
const Lab = require('../models/Lab')
const Purchase=require('../models/Purchase_model')
const Complaint = require('../models/complaint')
const User = require('../models/User')
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

        const lab = await Lab.findOne({ LabName: labName.trim() })
        if (!lab) {
            throw new NotFoundError('Lab not found')
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
        const totalResources =
            await LabResource.countDocuments({
                labName: labName.trim()
            })

        lab.NumResources = totalResources
        await lab.save()

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
       
        const labs = await Lab.find({}).select('LabName').lean()
        const existingLabNames = labs.map((lab) => lab.LabName.trim())
        filter.labName = filter.labName
            ? { $eq: filter.labName, $in: existingLabNames }
            : { $in: existingLabNames }

        const resources = await LabResource.find(filter).sort('createdAt')
        res.status(StatusCodes.OK).json({ resources, count: resources.length })
    } catch (error) {
        next(error)
    }
}

// DELETE /admin/LabResource/:id
const deleteLabResource = async (req, res, next) => {
    try {
        const resource = await LabResource.findByIdAndDelete(req.params.id)

        if (!resource) {
            throw new NotFoundError('Resource not found')
        }

        const lab = await Lab.findOne({ LabName: resource.labName.trim() })
        if (lab) {
            lab.NumResources = await LabResource.countDocuments({
                labName: lab.LabName.trim()
            })
            await lab.save()
        }

        res.status(StatusCodes.OK).json({
            resource,
            message: 'Resource deleted successfully'
        })
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

// PATCH /admin/profile
const editAdminProfile = async (req, res, next) => {
    try {
        const { name, email, phone, department, password } = req.body
        const admin = await User.findById(req.user.userId)

        if (!admin || !['admin', 'hod'].includes(admin.role)) {
            throw new NotFoundError('Admin profile not found')
        }

        if (name !== undefined) {
            if (!name.trim()) throw new BadRequestError('Name cannot be empty')
            admin.name = name.trim()
        }
        if (email !== undefined) {
            const normalizedEmail = email.toLowerCase().trim()
            if (!normalizedEmail) throw new BadRequestError('Email cannot be empty')
            const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: admin._id } })
            if (existing) throw new BadRequestError('A user with this email already exists')
            admin.email = normalizedEmail
        }
        if (phone !== undefined) admin.phone = phone.trim()
        if (department !== undefined) admin.department = department.trim()
        if (password && password.trim()) admin.password = password.trim()

        await admin.save()

        res.status(StatusCodes.OK).json({
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                department: admin.department,
                password: admin.password,
                role: admin.role,
            },
            message: 'Profile updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    AddResourcesToLab,
    getAllLabResources,
    deleteLabResource,
    getAllComplaints,
    getAllComplaintsByLab,
    editComplaintStatus,
    editAdminProfile
};
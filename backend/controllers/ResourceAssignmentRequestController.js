const { StatusCodes } = require("http-status-codes");
const {
    BadRequestError,
    NotFoundError,
} = require("../error");

const Purchase = require("../models/Purchase_model");
const Lab = require("../models/Lab");
const LabResource = require("../models/Labresource");
const ResourceAssignmentRequest = require("../models/ResourceAssignmentRequest");

// POST /admin/resource-assignment-request
// Send a resource assignment request to the Lab Incharge
const createResourceAssignmentRequest = async (req, res, next) => {
    try {
        const {
            purchaseId,
            labName,
            quantity = 1,
        } = req.body;

        if (!purchaseId || !labName) {
            throw new BadRequestError(
                "Please provide purchaseId and labName"
            );
        }

        const qty = Number(quantity);

        if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
            throw new BadRequestError(
                "quantity must be a whole number between 1 and 100"
            );
        }

        // Find selected lab
        const lab = await Lab.findOne({
            LabName: labName.trim(),
        });

        if (!lab) {
            throw new NotFoundError("Lab not found");
        }

        // Lab must have an assigned Lab Incharge
        if (!lab.AssignFaculty) {
            throw new BadRequestError(
                "No Lab Incharge is assigned to this lab"
            );
        }

        // Find selected purchase
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }

        // Availability belongs to this specific purchase because its fund type
        // is part of every asset ID generated from it.
        const totalQuantity = purchase.quantity;
        const assignedQuantity = await LabResource.countDocuments({
            purchase: purchase._id,
        });

        // Count quantities already requested and still pending
        const pendingRequests = await ResourceAssignmentRequest.aggregate([
            {
                $match: {
                    purchase: purchase._id,
                    status: "Pending",
                },
            },
            {
                $group: {
                    _id: null,
                    quantity: { $sum: "$quantity" },
                },
            },
        ]);

        const pendingQuantity =
            pendingRequests.length > 0
                ? pendingRequests[0].quantity
                : 0;

        const remainingQuantity =
            totalQuantity - assignedQuantity - pendingQuantity;

        if (qty > remainingQuantity) {
            throw new BadRequestError(
                `Only ${remainingQuantity} resource(s) are available for assignment`
            );
        }

        // Create approval request ONLY.
        // No LabResource is created here.
        const request = await ResourceAssignmentRequest.create({
            purchase: purchase._id,
            lab: lab._id,
            labIncharge: lab.AssignFaculty,
            quantity: qty,
            status: "Pending",
        });

        res.status(StatusCodes.CREATED).json({
            message: "Resource assignment request sent for approval",
            request,
            remainingQuantity,
        });

    } catch (error) {
        next(error);
    }
};
const getAllResourceAssignmentRequests = async (req, res, next) => {
    try {
        const requests = await ResourceAssignmentRequest.find()
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


module.exports = {
    createResourceAssignmentRequest,
    getAllResourceAssignmentRequests,
};
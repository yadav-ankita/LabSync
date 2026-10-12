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
        const { assetIds, labName } = req.body;

        if (
            !Array.isArray(assetIds) ||
            assetIds.length === 0 ||
            !labName
        ) {
            throw new BadRequestError(
                "Please select at least one asset and a lab"
            );
        }

        if (
            assetIds.some(
                (id) => typeof id !== "string" ||
                    !/^[a-f\d]{24}$/i.test(id)
            ) ||
            new Set(assetIds).size !== assetIds.length
        ) {
            throw new BadRequestError(
                "Selected asset IDs are invalid or duplicated"
            );
        }

        const lab = await Lab.findOne({
            LabName: labName.trim(),
        });

        if (!lab) {
            throw new NotFoundError("Lab not found");
        }

        if (!lab.AssignFaculty) {
            throw new BadRequestError(
                "No Lab Incharge is assigned to this lab"
            );
        }

        // Load the exact assets selected in the form.
        const assets = await LabResource.find({
            _id: { $in: assetIds },
        });

        if (assets.length !== assetIds.length) {
            throw new BadRequestError(
                "One or more selected assets could not be found"
            );
        }

        // Only unassigned, available assets can be requested.
        const invalidAsset = assets.find(
            (asset) =>
                asset.labName !== "Not Assigned" ||
                asset.status !== "Available"
        );

        if (invalidAsset) {
            throw new BadRequestError(
                `Asset ${invalidAsset.assetId} is no longer available`
            );
        }

        // A selected asset cannot already be reserved by another
        // pending assignment request.
        const existingRequest =
            await ResourceAssignmentRequest.findOne({
                status: "Pending",
                assets: { $in: assetIds },
            });

        if (existingRequest) {
            throw new BadRequestError(
                "One or more selected assets are already reserved by a pending request"
            );
        }

        // Keep the legacy purchase field populated when all selected
        // assets belong to the same purchase.
       const purchaseIds = [
    ...new Set(
        assets
            .filter((asset) => asset.purchase)
            .map((asset) => asset.purchase.toString())
    ),
];

        const requestData = {
            lab: lab._id,
            labIncharge: lab.AssignFaculty,
            quantity: assets.length,
            assets: assets.map((asset) => asset._id),
            status: "Pending",
        };

        if (purchaseIds.length === 1) {
            requestData.purchase = purchaseIds[0];
        }

        const request = await ResourceAssignmentRequest.create(requestData);

        res.status(StatusCodes.CREATED).json({
            message: "Resource assignment request sent for approval",
            request,
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
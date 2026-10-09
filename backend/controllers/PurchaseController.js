const { StatusCodes } = require("http-status-codes");
const Purchase = require("../models/Purchase_model");
const LabResource = require("../models/Labresource");
const ResourceAssignmentRequest = require("../models/ResourceAssignmentRequest");
const { BadRequestError, NotFoundError } = require("../error");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");



// POST /api/v1/admin/purchases
// Record a new purchase
const createPurchase = async (req, res, next) => {
    try {
        const {
            date,
            particulars,
            supplierName,
            billNumber,
            billDate,
            fundType,
            quantity,
            unitCost,
            salesTax,
            freight,
            signature,
            remarks
        } = req.body;

        if (
            !date ||
            !particulars ||
            !supplierName ||
            !billNumber ||
            !billDate ||
            !fundType ||
            !quantity ||
            unitCost === undefined
        ) {
            throw new BadRequestError(
                "Please provide all required purchase details"
            );
        }

        // Automatically calculate Total Cost
        const calculatedTotalCost =
            Number(quantity) * Number(unitCost);

        // Automatically calculate Grand Total
        const calculatedGrandTotal =
            calculatedTotalCost +
            Number(salesTax || 0) +
            Number(freight || 0);

        const purchase = await Purchase.create({
            date,
            particulars,
            supplierName,
            billNumber,
            billDate,
            fundType,
            quantity,
            unitCost,

            totalCost: calculatedTotalCost,

            salesTax,
            freight,

            grandTotal: calculatedGrandTotal,

            signature,
            remarks
        });

        res.status(StatusCodes.CREATED).json({
            message: "Purchase recorded successfully",
            purchase
        });

    } catch (error) {
        next(error);
    }
};

// PATCH /api/v1/admin/purchases/:id
// Update an existing purchase
const updatePurchase = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            date,
            particulars,
            supplierName,
            billNumber,
            billDate,
            fundType,
            quantity,
            unitCost,
            salesTax,
            freight,
            signature,
            remarks
        } = req.body;

        if (
            !date ||
            !particulars ||
            !supplierName ||
            !billNumber ||
            !billDate ||
            !fundType ||
            !quantity ||
            unitCost === undefined
        ) {
            throw new BadRequestError(
                "Please provide all required purchase details"
            );
        }

        const purchase = await Purchase.findById(id);

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }

        // Automatically calculate Total Cost
        const calculatedTotalCost =
            Number(quantity) * Number(unitCost);

        // Automatically calculate Grand Total
        const calculatedGrandTotal =
            calculatedTotalCost +
            Number(salesTax || 0) +
            Number(freight || 0);

        // Update purchase details
        purchase.date = date;
        purchase.particulars = particulars.trim();
        purchase.supplierName = supplierName.trim();
        purchase.billNumber = billNumber.trim();
        purchase.billDate = billDate;
        purchase.fundType = fundType;

        purchase.quantity = Number(quantity);
        purchase.unitCost = Number(unitCost);

        purchase.totalCost = calculatedTotalCost;

        purchase.salesTax = Number(salesTax || 0);
        purchase.freight = Number(freight || 0);

        purchase.grandTotal = calculatedGrandTotal;

        purchase.signature = signature?.trim() || "";
        purchase.remarks = remarks?.trim() || "";

        await purchase.save();

        res.status(StatusCodes.OK).json({
            message: "Purchase updated successfully",
            purchase
        });

    } catch (error) {
        next(error);
    }
};

// GET /api/v1/admin/purchases
// View complete purchase register
const getPurchases = async (req, res, next) => {
    try {
        const purchases = await Purchase
            .find({})
            .sort({ date: -1 });

        res.status(StatusCodes.OK).json({
            purchases,
            count: purchases.length
        });

    } catch (error) {
        next(error);
    }
};



// GET /api/v1/admin/purchases/resources
// Get combined resource availability for Resource Management
const getAvailableResources = async (req, res, next) => {
    try {
        const purchases = await Purchase.find({});

        const LabResource = require("../models/Labresource");

        // Group purchases by resource name
        const resourceMap = {};

        for (const purchase of purchases) {
            const key = purchase.particulars.trim().toLowerCase();

            if (!resourceMap[key]) {
                resourceMap[key] = {
                    _id: purchase._id,
                    particulars: purchase.particulars,
                    totalQuantity: 0,
                    purchaseIds: []
                };
            }

            resourceMap[key].totalQuantity += purchase.quantity;
            resourceMap[key].purchaseIds.push(purchase._id);
        }

        // Calculate assigned and remaining quantity
        const resources = await Promise.all(
            Object.values(resourceMap).map(async (resource) => {

                const assignedQuantity =
                    await LabResource.countDocuments({
                        resourceName: {
                            $regex: `^${escapeRegex(resource.particulars.trim())}$`,
                            $options: "i"
                        }
                    });

                const pendingRequests = await ResourceAssignmentRequest.aggregate([
                    {
                        $match: {
                            purchase: { $in: resource.purchaseIds },
                            status: "Pending"
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            quantity: { $sum: "$quantity" }
                        }
                    }
                ]);
                const pendingQuantity = pendingRequests[0]?.quantity || 0;

                return {
                    ...resource,
                    assignedQuantity,
                    pendingQuantity,
                    remainingQuantity: Math.max(
                        0,
                        resource.totalQuantity - assignedQuantity - pendingQuantity
                    )
                };
            })
        );

        res.status(StatusCodes.OK).json({
            resources,
            count: resources.length
        });

    } catch (error) {
        next(error);
    }
};



// GET /api/v1/admin/purchases/:id
// View a particular purchase
const getPurchase = async (req, res, next) => {
    try {
        const { id } = req.params;

        const purchase = await Purchase.findById(id);

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }

        res.status(StatusCodes.OK).json({
            purchase
        });

    } catch (error) {
        next(error);
    }
};



module.exports = {
    createPurchase,
    getPurchases,
    getAvailableResources,
    getPurchase,
    updatePurchase
};
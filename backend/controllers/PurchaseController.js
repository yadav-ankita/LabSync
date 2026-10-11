const { StatusCodes } = require("http-status-codes");
const Purchase = require("../models/Purchase_model");
const LabResource = require("../models/Labresource");
const ResourceAssignmentRequest = require("../models/ResourceAssignmentRequest");
const { BadRequestError, NotFoundError } = require("../error");
const FundType = require("../models/FundType");
const { DEFAULT_FUND_TYPES } = require("../utils/fundTypes");

const validateFundType = async (value) => {
    const code = String(value || "").trim().toUpperCase();
    const isDefault = DEFAULT_FUND_TYPES.includes(code);
    const isAddedFund = !isDefault && await FundType.exists({ code });
    if (!isDefault && !isAddedFund) {
        throw new BadRequestError("Please select an existing fund type.");
    }
    return code;
};
const VALID_CATEGORIES = [
    "Computers",
    "Monitors",
    "CPUs",
    "Keyboards",
    "Mouse",
    "Printers",
    "Projectors",
    "Networking Equipment",
    "Power Backup",
    "Servers",
    "Raspberry Pi Kits",
    "Furniture",
    "Electrical Equipment",
    "Cameras",
    "Software Licenses",
    "Other Laboratory Equipment"
];

const validateCategory = (category) => {
    if (!VALID_CATEGORIES.includes(category)) {
        throw new BadRequestError("Please select a valid resource category.");
    }

    return category;
};
// POST /api/v1/admin/purchases
// Record a new purchase
const createPurchase = async (req, res, next) => {
    try {
        const {
            date,
            particulars,
            category,
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
            !category ||
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

        const normalizedFundType = await validateFundType(fundType);
        const normalizedCategory = validateCategory(category);

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
            category: normalizedCategory,
            supplierName,
            billNumber,
            billDate,
            fundType: normalizedFundType,
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
            category,
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
            !category ||
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

        const normalizedFundType = await validateFundType(fundType);
        const normalizedCategory = validateCategory(category);

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
        purchase.category = normalizedCategory;
        purchase.supplierName = supplierName.trim();
        purchase.billNumber = billNumber.trim();
        purchase.billDate = billDate;
        purchase.fundType = normalizedFundType;

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
        const LabResource = require("../models/Labresource");
        const purchases = await Purchase.find({}).sort({ date: -1, createdAt: -1 }).lean();

        // Keep each purchase distinct: its fund type determines generated asset IDs.
        const resources = await Promise.all(purchases.map(async (purchase) => {
            const assignedQuantity = await LabResource.countDocuments({
                purchase: purchase._id
            });

            const pendingRequests = await ResourceAssignmentRequest.aggregate([
                {
                    $match: {
                        purchase: purchase._id,
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
                ...purchase,
                totalQuantity: purchase.quantity,
                assignedQuantity,
                pendingQuantity,
                remainingQuantity: Math.max(
                    0,
                    purchase.quantity - assignedQuantity - pendingQuantity
                )
            };
        }));

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
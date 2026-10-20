const { StatusCodes } = require("http-status-codes");
const Purchase = require("../models/Purchase_model");
const LabResource = require("../models/Labresource");
const ResourceAssignmentRequest = require("../models/ResourceAssignmentRequest");
const { BadRequestError, NotFoundError } = require("../error");
const FundType = require("../models/FundType");
const { DEFAULT_FUND_TYPES } = require("../utils/fundTypes");
const generateAssetId = require("../utils/Generateassetid");
const { validateConfiguration } = require("../utils/configurationTemplates");
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
    "Desktops",
    "Laptops",
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
    "Software Licenses"
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
    let createdPurchase = null;

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
            remarks,
            configuration,
            configurationRemarks
        } = req.body;

        if (
            !date ||
            !particulars ||
            !category ||
            !supplierName ||
            !billNumber ||
            !billDate ||
            !fundType ||
            quantity === undefined ||
            quantity === null ||
            Number(quantity) <= 0 ||
            !Number.isInteger(Number(quantity)) ||
            unitCost === undefined ||
            !Number.isFinite(Number(unitCost)) ||
            Number(unitCost) < 0
        ) {
            throw new BadRequestError(
                "Please provide valid purchase details"
            );
        }

        const normalizedFundType = await validateFundType(fundType);
        const normalizedCategory = validateCategory(category);
        let normalizedConfiguration;

try {
    normalizedConfiguration = validateConfiguration(
        normalizedCategory,
        configuration
    );
} catch (error) {
    throw new BadRequestError(error.message);
}

        const qty = Number(quantity);
        const cost = Number(unitCost);
        const tax = Number(salesTax || 0);
        const transport = Number(freight || 0);

        if (
            !Number.isFinite(tax) ||
            !Number.isFinite(transport) ||
            tax < 0 ||
            transport < 0
        ) {
            throw new BadRequestError(
                "Sales tax and freight must be valid non-negative numbers"
            );
        }

        const calculatedTotalCost = qty * cost;
        const calculatedGrandTotal =
            calculatedTotalCost + tax + transport;

        // Create the purchase record first.
        const purchase = await Purchase.create({
            date,
            particulars,
            category: normalizedCategory,
            supplierName,
            billNumber,
            billDate,
            fundType: normalizedFundType,
            quantity: qty,
            unitCost: cost,
            totalCost: calculatedTotalCost,
            salesTax: tax,
            freight: transport,
            grandTotal: calculatedGrandTotal,
            signature,
            remarks,
            configuration: normalizedConfiguration,
            configurationRemarks: (configurationRemarks || "").trim(),
        });

        createdPurchase = purchase;

        // Create one individual asset record for every purchased unit.
        const assetRecords = [];

        for (let i = 0; i < qty; i++) {
            const generated = await generateAssetId.generateProvisionalAssetId({
                resourceName: particulars,
                fundType: normalizedFundType
            });

            assetRecords.push({
                assetId: generated.assetId,
                originalAssetId: null,
                labName: "Not Assigned",
                previousLabName: null,
                labCode: null,
                resourceName: particulars,
                purchase: purchase._id,
                resourceCode: generated.resourceCode,
                serialNumber: generated.serialNumber,
                status: "Available"
            });
        }

        await LabResource.insertMany(assetRecords, {
            ordered: true
        });

        res.status(StatusCodes.CREATED).json({
            message: "Purchase recorded and assets created successfully",
            purchase,
            assetsCreated: assetRecords.length
        });

    } catch (error) {
        // Avoid leaving a purchase record behind if asset creation fails.
        if (createdPurchase) {
            try {
                await LabResource.deleteMany({
                    purchase: createdPurchase._id
                });

                await Purchase.findByIdAndDelete(createdPurchase._id);
            } catch (cleanupError) {
                console.error(
                    "Purchase cleanup failed:",
                    cleanupError
                );
            }
        }

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
            remarks,
            configuration,
            configurationRemarks
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
        let normalizedConfiguration;

try {
    normalizedConfiguration = validateConfiguration(
        normalizedCategory,
        configuration
    );
} catch (error) {
    throw new BadRequestError(error.message);
}
        const purchase = await Purchase.findById(id);

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }

        if (
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) <= 0 ||
    !Number.isFinite(Number(unitCost)) ||
    Number(unitCost) < 0 ||
    !Number.isFinite(Number(salesTax || 0)) ||
    Number(salesTax || 0) < 0 ||
    !Number.isFinite(Number(freight || 0)) ||
    Number(freight || 0) < 0
) {
    throw new BadRequestError(
        "Quantity must be a positive integer, and costs must be non-negative numbers"
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

purchase.configuration = normalizedConfiguration;
purchase.configurationRemarks = (configurationRemarks || "").trim();

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

// GET /api/v1/admin/purchases/resources

const getAvailableResources = async (req, res, next) => {
    try {
        const pendingRequests = await ResourceAssignmentRequest.find({
            status: "Pending",
            assets: { $exists: true, $ne: [] },
        }).select("assets");

        const pendingAssetIds = pendingRequests.flatMap((request) =>
            (request.assets || []).map((id) => id.toString())
        );

const projectorPurchases = await Purchase.find({
    $or: [
        { particulars: /projector/i },
        { category: /projector/i },
    ],
});


for (const purchase of projectorPurchases) {
    const assets = await LabResource.find({
        purchase: purchase._id,
    });

   
}

        const resources = await LabResource.find({
            labName: "Not Assigned",
            status: /*{ $nin: ["Maintenance", "Faulty", "Scrapped"] }*/ "Available",
            _id: { $nin: pendingAssetIds },
        })
.populate(
    "purchase",
    "particulars category fundType supplierName configuration configurationRemarks date billNumber billDate quantity"
)            
.sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json({
            resources: resources.map((asset) => {
                const item = asset.toObject();

                return {
                    ...item,
                    category: item.purchase?.category,
                    fundType: item.purchase?.fundType,
                };
            }),
            count: resources.length,
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
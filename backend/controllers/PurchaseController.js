const { StatusCodes } = require("http-status-codes");
const Purchase = require("../models/Purchase_model");
const LabResource=require("../models/LabResource");
const { BadRequestError, NotFoundError } = require("../error");



//POST /api/v1/admin/purchases
//Record a new purchase
const createPurchase = async (req, res, next) => {
    try {
        const {
            date,
            particulars,
            supplierName,
            billNumber,
            billDate,
            quantity,
            unitCost,
            totalCost,
            salesTax,
            freight,
            grandTotal,
            signature,
            remarks
        } = req.body;

        if (
            !date ||
            !particulars ||
            !supplierName ||
            !billNumber ||
            !billDate ||
            !quantity ||
            unitCost === undefined ||
            totalCost === undefined ||
            grandTotal === undefined
        ) {
            throw new BadRequestError(
                "Please provide all required purchase details"
            );
        }

        const purchase = await Purchase.create({
            date,
            particulars,
            supplierName,
            billNumber,
            billDate,
            quantity,
            unitCost,
            totalCost,
            salesTax,
            freight,
            grandTotal,
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

        const LabResource = require("../models/LabResource");

        // Group purchases by resource name
        const resourceMap = {};

        for (const purchase of purchases) {
            const key = purchase.particulars.trim().toLowerCase();

            if (!resourceMap[key]) {
                resourceMap[key] = {
                    _id: purchase._id,
                    particulars: purchase.particulars,
                    totalQuantity: 0
                };
            }

            resourceMap[key].totalQuantity += purchase.quantity;
        }

        // Calculate assigned and remaining quantity
        const resources = await Promise.all(
            Object.values(resourceMap).map(async (resource) => {

                const assignedQuantity =
                    await LabResource.countDocuments({
                        resourceName: {
                            $regex: `^${resource.particulars}$`,
                            $options: "i"
                        }
                    });

                return {
                    ...resource,
                    assignedQuantity,
                    remainingQuantity:
                        resource.totalQuantity - assignedQuantity
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
    getPurchase
};
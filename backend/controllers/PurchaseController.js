const { StatusCodes } = require("http-status-codes");
const Purchase = require("../models/Purchase_model");
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
    getPurchase
};
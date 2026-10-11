const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../error");
const FundType = require("../models/FundType");

const getFundTypes = async (req, res, next) => {
  try {
    const fundTypes = await FundType.find({}).sort({ code: 1 });
    res.status(StatusCodes.OK).json({ fundTypes });
  } catch (error) {
    next(error);
  }
};

const addFundType = async (req, res, next) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();

    if (!/^[A-Z0-9]{2,12}$/.test(code)) {
      throw new BadRequestError(
        "Fund code must contain 2 to 12 letters or numbers."
      );
    }

    const existing = await FundType.findOne({ code });

    if (existing) {
      throw new BadRequestError("This fund type already exists.");
    }

    const fundType = await FundType.create({ code });

    res.status(StatusCodes.CREATED).json({
      message: "Fund type added successfully.",
      fundType,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new BadRequestError("This fund type already exists."));
    }

    next(error);
  }
};

const deleteFundType = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      throw new BadRequestError("Invalid fund type ID.");
    }

    const fundType = await FundType.findByIdAndDelete(id);

    if (!fundType) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Fund type not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Fund type "${fundType.code}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFundTypes,
  addFundType,
  deleteFundType,
};
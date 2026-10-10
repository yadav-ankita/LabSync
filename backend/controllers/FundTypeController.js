const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../error");
const FundType = require("../models/FundType");
const { DEFAULT_FUND_TYPES } = require("../utils/fundTypes");

const getFundTypes = async (req, res, next) => {
  try {
    await Promise.all(DEFAULT_FUND_TYPES.map((code) => FundType.updateOne(
      { code },
      { $setOnInsert: { code } },
      { upsert: true }
    )));

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
      throw new BadRequestError("Fund code must contain 2 to 12 letters or numbers.");
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

module.exports = { getFundTypes, addFundType };
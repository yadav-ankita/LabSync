const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
} = require("../error");

const Maintenance = require("../models/Maintenance");

// Get maintenance requests waiting for HOD approval
const getPendingMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find({
      hodApprovalStatus: "Pending",
    })
      .populate({
        path: "complaint",
        populate: {
          path: "faculty",
          select: "name email lab_no",
        },
      })
      .sort("-createdAt");
      console.log(maintenance)
    res.status(StatusCodes.OK).json({
      maintenance,
      count: maintenance.length,
    });
  } catch (error) {
    next(error);
  }
};

// Approve or reject a maintenance request
const updateMaintenanceApproval = async (req, res, next) => {
  try {
    const { maintenanceId, approvalStatus, hodRemarks } = req.body;

    if (!maintenanceId || !approvalStatus) {
      throw new BadRequestError(
        "Maintenance ID and approval status are required."
      );
    }

    if (!["Approved", "Rejected"].includes(approvalStatus)) {
      throw new BadRequestError(
        "Approval status must be Approved or Rejected."
      );
    }

    const maintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      {
        hodApprovalStatus: approvalStatus,
        hodApprovalDate: new Date(),
        hodRemarks: hodRemarks || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "complaint",
      populate: {
        path: "faculty",
        select: "name email lab_no",
      },
    });

    if (!maintenance) {
      throw new NotFoundError("Maintenance record not found.");
    }

    res.status(StatusCodes.OK).json({
      message: `Maintenance request ${approvalStatus.toLowerCase()} successfully.`,
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingMaintenance,
  updateMaintenanceApproval,
};
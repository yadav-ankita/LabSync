const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
} = require("../error");

const Maintenance = require("../models/Maintenance");
const Complaint = require("../models/complaint");


// GET /admin/maintenance
const getAllMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find({})
      .populate({
        path: "complaint",
        populate: {
          path: "faculty",
          select: "name email lab_no",
        },
      })
      .sort("-createdAt");

    res.status(StatusCodes.OK).json({
      maintenance,
      count: maintenance.length,
    });
  } catch (error) {
    next(error);
  }
};


// POST /admin/maintenance
// Create maintenance record from a complaint
const createMaintenance = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      throw new BadRequestError("Please provide complaintId");
    }

    // Check complaint exists
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new NotFoundError("Complaint not found");
    }

    // Prevent duplicate maintenance record
    const existingMaintenance = await Maintenance.findOne({
      complaint: complaintId,
    });

    if (existingMaintenance) {
      throw new BadRequestError(
        "Maintenance record already exists for this complaint"
      );
    }

    const maintenance = await Maintenance.create({
      complaint: complaintId,
       hodApprovalStatus: "Pending",
    });

    await Complaint.findByIdAndUpdate(
    complaintId,
    { status: "In Progress" },
    { new: true }
);

    const populatedMaintenance = await Maintenance.findById(
      maintenance._id
    ).populate({
      path: "complaint",
      populate: {
        path: "faculty",
        select: "name email lab_no",
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Maintenance record created successfully",
      maintenance: populatedMaintenance,
    });
  } catch (error) {
    next(error);
  }
};


// PATCH /admin/maintenance/:id
const updateMaintenance = async (req, res, next) => {
  try {
    const maintenanceId = req.params.id;

    const maintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      req.body,
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
      throw new NotFoundError("Maintenance record not found");
    }
    if (maintenance.maintenanceStatus === "Completed") {
    await Complaint.findByIdAndUpdate(
        maintenance.complaint._id,
        { status: "Resolved" },
        { new: true }
    );
}

    res.status(StatusCodes.OK).json({
      message: "Maintenance updated successfully",
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllMaintenance,
  createMaintenance,
  updateMaintenance,
};
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
} = require("../error");

const Maintenance = require("../models/Maintenance");
const Complaint = require("../models/complaint");
const LabResource = require("../models/Labresource");

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
    const resource = await LabResource.findOne({
  assetId: complaint.resourceId,
});

if (!resource) {
  throw new NotFoundError(
    "Lab resource associated with this complaint was not found."
  );
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

resource.status = "Maintenance";
await resource.save();
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

    // First find the maintenance record
    const maintenance = await Maintenance.findById(maintenanceId).populate({
      path: "complaint",
      populate: {
        path: "faculty",
        select: "name email lab_no",
      },
    });

    if (!maintenance) {
      throw new NotFoundError("Maintenance record not found");
    }

    // If trying to complete maintenance,
    // asset condition MUST be selected
    if (
      req.body.maintenanceStatus === "Completed" &&
      !req.body.assetConditionAfterRepair
    ) {
      throw new BadRequestError(
        "Please specify the asset condition after repair."
      );
    }

    // Update maintenance fields
   // Prepare update data
const updateData = { ...req.body };

// Don't save empty asset condition
if (updateData.assetConditionAfterRepair === "") {
  delete updateData.assetConditionAfterRepair;
}

// Update maintenance fields
Object.assign(maintenance, updateData);

    // Only check asset AFTER repair is completed
    if (maintenance.maintenanceStatus === "Completed") {

      if (!maintenance.assetConditionAfterRepair) {
        throw new BadRequestError(
          "Please specify the asset condition after repair."
        );
      }

      const resource = await LabResource.findOne({
        assetId: maintenance.complaint.resourceId,
      });

      if (!resource) {
        throw new NotFoundError(
          "Lab resource associated with this complaint was not found."
        );
      }
let resourceUpdate = {};

if (maintenance.assetConditionAfterRepair === "Usable") {
  resourceUpdate = {
    status: "Available",
  };
}

if (maintenance.assetConditionAfterRepair === "Beyond Repair") {
  resourceUpdate = {
    status: "Scrapped",
    previousLabName: maintenance.complaint.labName,
    labName: "Not Assigned",
      originalAssetId: maintenance.complaint.resourceId,
  assetId: `SCRAP-${maintenance.complaint.resourceId}`,
  };
}

const updatedResource = await LabResource.findOneAndUpdate(
  { assetId: maintenance.complaint.resourceId },
  resourceUpdate,
  { new: true, runValidators: true }
);

console.log("RESOURCE AFTER UPDATE:", {
  assetId: updatedResource?.assetId,
  status: updatedResource?.status,
  labName: updatedResource?.labName,
  previousLabName: updatedResource?.previousLabName,
});

      // Maintenance completed → complaint resolved
      await Complaint.findByIdAndUpdate(
        maintenance.complaint._id,
        { status: "Resolved" },
        { new: true }
      );

      // Set resolution date if not already provided
      if (!maintenance.resolutionDate) {
        maintenance.resolutionDate = new Date();
      }
    }

    await maintenance.save();

    res.status(StatusCodes.OK).json({
      message: "Maintenance updated successfully",
      maintenance,
    });

  } catch (error) {
    next(error);
  }
};

const getFacultyMaintenance = async (req, res, next) => {
  try {
    const facultyId = req.user.userId;

    const complaints = await Complaint.find({
      faculty: facultyId,
    }).select("_id");

    const complaintIds = complaints.map((c) => c._id);

    const maintenance = await Maintenance.find({
      complaint: { $in: complaintIds },
    })
      .populate("complaint")
      .sort("-createdAt");

    res.status(200).json({
      maintenance,
      count: maintenance.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaintenance,
  createMaintenance,
  updateMaintenance,
  getFacultyMaintenance,
};
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
} = require("../error");

const Maintenance = require("../models/Maintenance");
const TransferRequest = require("../models/TransferRequest");
const LabResource = require("../models/LabResource");
const Lab = require("../models/Lab");

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
const getPendingTransferRequests = async (req, res, next) => {
  try {
    const requests = await TransferRequest.find({
      status: "In Progress",
      "hodApproval.status": "Pending",
    })
      .populate("assets")
      .populate("fromLab", "LabName AssignFaculty")
      .populate("toLab", "LabName AssignFaculty")
      .populate("requestedBy", "name email")
      .populate("otherIncharge", "name email")
      .sort("-createdAt");

    res.status(StatusCodes.OK).json({
      requests,
      count: requests.length,
    });
  } catch (error) {
    next(error);
  }
};
const updateTransferApproval = async (req, res, next) => {
  try {
    const { approvalStatus, hodRemarks } = req.body;

    if (!approvalStatus) {
      throw new BadRequestError(
        "Approval status is required."
      );
    }

    if (!["Approved", "Rejected"].includes(approvalStatus)) {
      throw new BadRequestError(
        "Approval status must be Approved or Rejected."
      );
    }

    const request = await TransferRequest.findById(req.params.id);

    if (!request) {
      throw new NotFoundError(
        "Transfer request not found."
      );
    }

    if (request.status !== "In Progress") {
      throw new BadRequestError(
        "Both Lab Incharges must approve the transfer before HOD approval."
      );
    }

    if (request.hodApproval.status !== "Pending") {
      throw new BadRequestError(
        "This transfer request has already been processed by HOD."
      );
    }

    request.hodApproval.status = approvalStatus;
    request.hodApproval.decidedAt = new Date();

    // HOD rejected
    if (approvalStatus === "Rejected") {
      request.status = "Rejected";
      request.rejectionReason = hodRemarks?.trim() || null;

      await request.save();

      return res.status(StatusCodes.OK).json({
        message: "Transfer request rejected by HOD.",
        request,
      });
    }

    // HOD approved → perform actual transfer
    const assets = await LabResource.find({
      _id: { $in: request.assets },
    });

    if (assets.length !== request.assets.length) {
      throw new NotFoundError(
        "One or more resources in the transfer request were not found."
      );
    }

    const fromLab = await Lab.findById(request.fromLab);
    const toLab = await Lab.findById(request.toLab);

    if (!fromLab || !toLab) {
      throw new NotFoundError(
        "Source or destination lab not found."
      );
    }

    // Make sure every asset is still in the original lab
    const invalidAsset = assets.find(
      (asset) => asset.labName !== fromLab.LabName
    );

    if (invalidAsset) {
      throw new BadRequestError(
        "One or more resources are no longer assigned to the source lab."
      );
    }

    // Move ALL requested assets
    for (const asset of assets) {
      asset.labName = toLab.LabName;
      asset.labCode = toLab.LabName;

      await asset.save();
    }

    // Update resource counts
    fromLab.NumResources = await LabResource.countDocuments({
      labName: fromLab.LabName,
    });

    toLab.NumResources = await LabResource.countDocuments({
      labName: toLab.LabName,
    });

    await fromLab.save();
    await toLab.save();

    // Mark transfer as completed
    request.status = "Transferred";
    request.completedAt = new Date();

    await request.save();

    return res.status(StatusCodes.OK).json({
      message:
        "Transfer request approved and all resources transferred successfully.",
      request,
      assets,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingMaintenance,
  updateMaintenanceApproval,
  getPendingTransferRequests,
  updateTransferApproval,
};
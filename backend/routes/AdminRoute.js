const express = require('express')
const router = express.Router();
const authUser = require('../middleware/authUser')
const authorizeRoles = require('../middleware/authorizeRoles')
const multer = require('multer')
const {
    previewStudentImport,
    confirmStudentImport,
    getStudentImportHistory,
    deleteStudentImportHistory,
} = require('../controllers/StudentImportController')
const {
    AddResourcesToLab,
    getAllLabResources,
    deleteLabResource,
    addConfigurationHistory,
    getAllComplaints,
    getAllComplaintsByLab,
    editComplaintStatus,
    editAdminProfile,
    getScrappedResources,
} = require("../controllers/AdminController");

const {
    getAllMaintenance,
    createMaintenance,
    updateMaintenance,
} = require("../controllers/MaintenanceController");

const {
    createResourceAssignmentRequest,
    getAllResourceAssignmentRequests,
} = require("../controllers/ResourceAssignmentRequestController");
const { getFundTypes, addFundType,deleteFundType } = require("../controllers/FundTypeController");

router.use(authUser)
const studentImportUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, callback) => {
        const extension = file.originalname.toLowerCase().split('.').pop()
        if (!['xlsx', 'csv'].includes(extension)) {
            const error = new Error('Only .xlsx and .csv files are supported.')
            error.code = 'INVALID_FILE_TYPE'
            return callback(error)
        }
        return callback(null, true)
    },
}).single('file')
const handleStudentImportUpload = (req, res, next) => {
    studentImportUpload(req, res, (error) => {
        if (error) {
            const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
            return res.status(status).json({ message: error.message })
        }
        return next()
    })
}

router.post('/students/import/preview', authorizeRoles('admin'), handleStudentImportUpload, previewStudentImport)
router.post('/students/import/confirm', authorizeRoles('admin'), handleStudentImportUpload, confirmStudentImport)
router.get('/students/import/history', authorizeRoles('admin'), getStudentImportHistory)
router.delete('/students/import/history/:id', authorizeRoles('admin'), deleteStudentImportHistory)
router.route("/profile").patch(authorizeRoles('admin', 'hod'), editAdminProfile)

router.get("/LabResource", authorizeRoles("admin", "hod"), getAllLabResources)
router.get("/LabResource/scrapped", authorizeRoles("admin", "hod"), getScrappedResources)
router.get("/complaints", authorizeRoles("admin", "hod"), getAllComplaints)
router.get("/complaints/lab/:labName", authorizeRoles("admin", "hod"), getAllComplaintsByLab)
router.get(
    "/resource-assignment-requests",
    authorizeRoles("admin", "hod"),
    getAllResourceAssignmentRequests
)

router.use(authorizeRoles('admin'))
router
  .route("/fund-types")
  .get(getFundTypes)
  .post(addFundType);

router
  .route("/fund-types/:id")
  .delete(deleteFundType);

router.route("/LabResource").post(AddResourcesToLab)
router.route("/LabResource/:id").delete(deleteLabResource)
router.route("/resource-assignment-request")
    .post(createResourceAssignmentRequest);
router.route("/complaints").patch(editComplaintStatus)

router.route("/maintenance").get(getAllMaintenance).post(createMaintenance);

router.route("/maintenance/:id").patch(updateMaintenance);
router.patch(
    "/LabResource/:id/configuration-history",
    addConfigurationHistory
);
module.exports = router;
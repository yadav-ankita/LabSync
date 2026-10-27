const crypto = require("crypto");
const ExcelJS = require("exceljs");
const { Readable } = require("stream");
const User = require("../models/User");
const Faculty = require("../models/Faculty_model");
const StudentImport = require("../models/StudentImport");
const { bcrypt } = require("../utils/passwords");
const sendEmail = require("../utils/sendEmail");
const { NotFoundError } = require("../error");

const MAX_ROWS = 100;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]{5,19}$/;

const normalizeHeader = (value) =>
    String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);

const parseRows = async (file) => {
    if (!file || !file.buffer) {
        const error = new Error("Please upload an .xlsx or .csv file.");
        error.statusCode = 400;
        throw error;
    }

    const extension = String(file.originalname || "").toLowerCase().split(".").pop();
    if (!["xlsx", "csv"].includes(extension)) {
        const error = new Error("Only .xlsx and .csv files are supported.");
        error.statusCode = 400;
        throw error;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        if (extension === "csv") {
            await workbook.csv.read(Readable.from([file.buffer]), {
                map: (value) => value,
            });
        } else {
            await workbook.xlsx.load(file.buffer);
        }

        const worksheet = workbook.worksheets[0];
        if (!worksheet || worksheet.rowCount < 1) {
            const error = new Error("The uploaded file does not contain student rows.");
            error.statusCode = 400;
            throw error;
        }

        const rowCount = worksheet.rowCount - 1;
        if (rowCount > MAX_ROWS) {
            const error = new Error(`The file may contain at most ${MAX_ROWS} student rows.`);
            error.statusCode = 400;
            throw error;
        }
        if (worksheet.columnCount > 50) {
            const error = new Error("The file contains too many columns.");
            error.statusCode = 400;
            throw error;
        }

        return {
            rows: Array.from({ length: worksheet.rowCount }, (_, rowIndex) =>
                Array.from({ length: worksheet.columnCount }, (_, columnIndex) =>
                    worksheet.getRow(rowIndex + 1).getCell(columnIndex + 1).text
                )
            ),
        };
    } catch (error) {
        if (error.statusCode) throw error;
        const invalidFile = new Error("The uploaded file could not be read as a valid spreadsheet.");
        invalidFile.statusCode = 400;
        throw invalidFile;
    }
};

const evaluateRows = async (file) => {
    const { rows: sheetRows } = await parseRows(file);
    if (sheetRows.length < 2) {
        const error = new Error("Include a header row and at least one student row.");
        error.statusCode = 400;
        throw error;
    }

    const headers = sheetRows[0].map(normalizeHeader);
    const emailIndex = headers.findIndex((header) => ["email", "email address"].includes(header));
    const phoneIndex = headers.findIndex((header) =>
        ["phone", "phone number", "mobile", "mobile number"].includes(header)
    );
    if (emailIndex < 0 || phoneIndex < 0) {
        const error = new Error("The file must include email and phone number columns.");
        error.statusCode = 400;
        throw error;
    }

    const seenEmails = new Set();
    const rows = sheetRows.slice(1)
        .map((cells, index) => ({ cells, rowNumber: index + 2 }))
        .filter(({ cells }) => cells.some((cell) => String(cell || "").trim()))
        .map(({ cells, rowNumber }) => {
            const email = String(cells[emailIndex] || "").trim().toLowerCase();
            const phone = String(cells[phoneIndex] || "").trim();
            const errors = [];

            if (!email || !EMAIL_PATTERN.test(email)) {
                errors.push("Enter a valid email address.");
            }
            if (!phone || !PHONE_PATTERN.test(phone)) {
                errors.push("Enter a valid phone number.");
            }
            if (email && seenEmails.has(email)) {
                return {
                    rowNumber,
                    email,
                    phone,
                    status: "duplicate",
                    errors: ["Email is duplicated in this file."],
                };
            }
            if (email) seenEmails.add(email);

            return {
                rowNumber,
                email,
                phone,
                status: errors.length ? "invalid" : "valid",
                errors,
            };
        });

    if (!rows.length) {
        const error = new Error("Include at least one student row.");
        error.statusCode = 400;
        throw error;
    }

    const candidateEmails = rows
        .filter((row) => row.status === "valid")
        .map((row) => row.email);
    if (candidateEmails.length) {
        const [existingUsers, existingFaculty] = await Promise.all([
            User.find({ email: { $in: candidateEmails } }).select("email").lean(),
            Faculty.find({ email: { $in: candidateEmails } }).select("email").lean(),
        ]);
        const existingEmails = new Set([
            ...existingUsers.map((account) => account.email.toLowerCase()),
            ...existingFaculty.map((account) => account.email.toLowerCase()),
        ]);

        rows.forEach((row) => {
            if (row.status === "valid" && existingEmails.has(row.email)) {
                row.status = "duplicate";
                row.errors = ["An account with this email already exists."];
            }
        });
    }

    return {
        rows,
        summary: {
            total: rows.length,
            valid: rows.filter((row) => row.status === "valid").length,
            duplicates: rows.filter((row) => row.status === "duplicate").length,
            invalid: rows.filter((row) => row.status === "invalid").length,
        },
    };
};

const generatePassword = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    return Array.from({ length: 10 }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
};

const toStoredRows = (rows) =>
    rows.map(({ errors, ...row }) => ({ ...row, messages: errors || [] }));

const toResponseRows = (rows) =>
    rows.map(({ messages, ...row }) => ({ ...row, errors: messages || [] }));

const previewStudentImport = async (req, res, next) => {
    try {
        const report = await evaluateRows(req.file);
        return res.status(200).json(report);
    } catch (error) {
        return next(error);
    }
};

const confirmStudentImport = async (req, res, next) => {
    try {
        const report = await evaluateRows(req.file);
        const fileName = String(req.file.originalname || "student-import")
            .replace(/[\\/]/g, "_")
            .replace(/[\u0000-\u001f]/g, "")
            .slice(0, 255);
        const importRecord = await StudentImport.create({
            fileName,
            importedBy: req.user.userId,
            status: "processing",
            summary: { total: report.summary.total },
            rows: toStoredRows(report.rows),
        });
        const results = [];
        let created = 0;
        let duplicates = report.summary.duplicates;
        let validationFailures = report.summary.invalid;
        let emailFailures = 0;

        for (const row of report.rows) {
            if (row.status !== "valid") {
                results.push(row);
                continue;
            }

            const password = generatePassword();
            let student;
            try {
                student = await User.create({
                    name: row.email.split("@")[0],
                    email: row.email,
                    phone: row.phone,
                    password: await bcrypt.hash(password, 12),
                    role: "student",
                });
            } catch (error) {
                if (error.code === 11000) {
                    duplicates += 1;
                    results.push({
                        ...row,
                        status: "duplicate",
                        errors: ["An account with this email already exists."],
                    });
                    continue;
                }

                console.error(`Student account creation failed for row ${row.rowNumber}:`, error);
                validationFailures += 1;
                results.push({
                    ...row,
                    status: "failed",
                    errors: ["Account creation failed."],
                });
                continue;
            }

            created += 1;
            try {
                await sendEmail({
                    to: student.email,
                    subject: "Your LabSync Student Account Credentials",
                    html: `
                        <p>Hello ${escapeHtml(student.name)},</p>
                        <p>Your LabSync student account is ready.</p>
                        <p>
                            <b>Login email:</b> ${escapeHtml(student.email)}<br/>
                            <b>Password:</b> ${escapeHtml(password)}
                        </p>
                        <p>Please sign in at LabSync using these credentials.</p>
                    `,
                });
                results.push({ ...row, status: "created", errors: [] });
            } catch (error) {
                emailFailures += 1;
                console.error(`Student credential email failed for ${student.email}:`, error);
                results.push({
                    ...row,
                    status: "email-failed",
                    errors: ["Account created, but credential email delivery failed."],
                });
            }
        }

        const summary = {
            total: report.summary.total,
            created,
            duplicates,
            validationFailures,
            emailFailures,
        };
        importRecord.status = "completed";
        importRecord.summary = summary;
        importRecord.rows = toStoredRows(results);
        await importRecord.save();

        return res.status(200).json({
            importId: importRecord._id,
            fileName: importRecord.fileName,
            createdAt: importRecord.createdAt,
            summary,
            rows: results,
        });
    } catch (error) {
        return next(error);
    }
};

const getStudentImportHistory = async (req, res, next) => {
    try {
        const imports = await StudentImport.find({})
            .select("fileName status summary rows createdAt")
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return res.status(200).json({
            imports: imports.map((entry) => ({
                ...entry,
                importId: entry._id,
                rows: toResponseRows(entry.rows || []),
            })),
        });
    } catch (error) {
        return next(error);
    }
};

const deleteStudentImportHistory = async (req, res, next) => {
    try {
        const importRecord = await StudentImport.findByIdAndDelete(req.params.id);
        if (!importRecord) {
            throw new NotFoundError("Student import history record not found.");
        }

        return res.status(200).json({ message: "Import history record deleted." });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    previewStudentImport,
    confirmStudentImport,
    getStudentImportHistory,
    deleteStudentImportHistory,
};

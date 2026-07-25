//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../model/Student')
const Complaint = require('../model/Complaint')
const LabManual = require('../model/LabManual')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../error')

const DEFAULT_PASSWORD = '1234'

const createToken = (student) => {
    return jwt.sign(
        { userId: student._id, studentId: student.studentId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME || '30d' }
    )
}

const formatStudent = (student) => ({
    studentId: student.studentId,
    name: student.username,
    email: student.email,
    branch: student.branch,
    semester: student.semester,
    profileComplete: Boolean(student.username && student.branch && student.semester),
})
const login = async (req, res) => {
    const { studentId, password } = req.body

    if (!studentId || !password) {
        throw new BadRequestError('Please provide student ID and password')
    }

    let student = await Student.findOne({ studentId })

    if (!student) {
        //const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
        student = await Student.create({
            studentId,
            password
            //password: hashedPassword,
        })
    }
    const isPasswordCorrect = password === student.password
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const token = createToken(student)

    res.status(StatusCodes.OK).json({
        student: formatStudent(student),
        token,
    })
}

const getProfileData = async (req, res) => {
    const student = await Student.findById(req.user.userId).select('-password')
    if (!student) {
        throw new BadRequestError('Student not found')
    }
    res.status(StatusCodes.OK).json({ student: formatStudent(student) })
}
// name, branch, semester and password are all editable here
const editProfile = async (req, res) => {
    const { username, email, branch, semester, password } = req.body

    const student = await Student.findById(req.user.userId)
    if (!student) {
        throw new BadRequestError('Student not found')
    }

    if (username !== undefined) student.username = username
    if (email !== undefined) student.email = email
    if (branch !== undefined) student.branch = branch
    if (semester !== undefined) student.semester = semester
    if (password) student.password = password

    await student.save()

    res.status(StatusCodes.OK).json({ student: formatStudent(student) })
}

const raiseComplaint = async (req, res) => {
    const { labName, issueType, resourceId, description } = req.body
    if (!labName || !issueType || !resourceId || !description) {
        throw new BadRequestError('Please provide labName, issueType, resourceId and description')
    }
    const complaint = await Complaint.create({
        student: req.user.userId,
        labName,
        issueType,
        resourceId,
        description,
    })
    res.status(StatusCodes.CREATED).json({ complaint })
}

const getComplaints = async (req, res) => {
    const complaints = await Complaint.find({ student: req.user.userId }).sort('-createdAt')
    res.status(StatusCodes.OK).json({ complaints, count: complaints.length })
}

// manuals are matched to the student's own semester (and branch, if set)
const getLabManuals = async (req, res) => {
    const student = await Student.findById(req.user.userId)
    if (!student) {
        throw new BadRequestError('Student not found')
    }
    if (!student.semester) {
        throw new BadRequestError('Please set your semester in your profile to view lab manuals')
    }

    const query = { semester: student.semester }
    if (student.branch) query.branch = student.branch

    const manuals = await LabManual.find(query).sort('-updatedAt')
    res.status(StatusCodes.OK).json({ manuals, count: manuals.length })
}

module.exports = {
    login,
    raiseComplaint,
    getProfileData,
    getLabManuals,
    editProfile,
    getComplaints,
}
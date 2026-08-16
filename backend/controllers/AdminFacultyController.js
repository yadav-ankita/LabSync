const { StatusCodes } = require('http-status-codes');
const Faculty=require('../models/Faculty_model')
const sendEmail = require('../utils/sendEmail')
const { BadRequestError, NotFoundError } = require('../error')
const crypto = require('crypto')

// Generates a readable random password, e.g. "aK7#pQ2mZ9"
const generateRandomPassword = (length = 10) => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%'
    const bytes = crypto.randomBytes(length)
    let password = ''
    for (let i = 0; i < length; i++) {
        password += charset[bytes[i] % charset.length]
    }
    return password
}
// module.exports = generateRandomPassword
// POST /faculty/  -> Lab Admin adds a new faculty (lab incharge)
// body: { name, email, lab_no }
// A random password is generated on the backend and stored against the
// faculty record so it can be emailed to them (immediately or later) via
// the /faculty/credentials endpoint.
const AddFaculties = async (req, res, next) => {
    try {
        const { name, email, lab_name } = req.body

        if (!name || !email || !lab_name) {
            throw new BadRequestError('Please provide name, email and lab_name')
        }

        const existingFaculty = await Faculty.findOne({ email: email.toLowerCase().trim() })
        if (existingFaculty) {
            throw new BadRequestError('A faculty with this email already exists')
        }

        const password = generateRandomPassword()

        const faculty = await Faculty.create({
            name,
            email,
            lab_name,
            password,
        })

        res.status(StatusCodes.CREATED).json({
            message:"Faculty Added Successfully",
            faculty: {
                _id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                password:faculty.password,
                lab_name: faculty.lab_name,
                createdAt: faculty.createdAt,
            },
        })
    } catch (error) {
        next(error)
    }
}

// GET /faculty/  -> list all faculties (password never returned to the client)
const getFaculties = async (req, res, next) => {
    try {
        const faculties = await Faculty.find({}).sort('-createdAt')
        res.status(StatusCodes.OK).json({ faculties, count: faculties.length })
    } catch (error) {
        next(error)
    }
}

// POST /faculty/credentials  -> emails the faculty their login credentials
// body: { password, email }
const emailCredentials = async (req, res, next) => {
    try {
        const { password, email } = req.body
        if (!password || !email) {
            throw new BadRequestError('Please provide both password and email')
        }

        const faculty = await Faculty.findOne({ email: email.toLowerCase().trim() })
        if (!faculty) {
            throw new NotFoundError('Faculty not found')
        }

        await sendEmail({
            to: faculty.email,
            subject: 'Your LabSync Lab Incharge Account Credentials',
            html: `
                <p>Hello ${faculty.name},</p>
                <p>Your LabSync Lab Incharge account has been created for <b>Lab ${faculty.lab_no}</b>.</p>
                <p>
                    <b>Login email:</b> ${faculty.email}<br/>
                    <b>Password:</b> ${faculty.password}
                </p>
                <p>Please log in and change your password after your first login.</p>
            `,
        })

        res.status(StatusCodes.OK).json({ message: `Credentials sent to ${faculty.email}` })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    emailCredentials,
    getFaculties,
    AddFaculties,
}

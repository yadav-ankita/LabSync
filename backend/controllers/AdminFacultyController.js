const { StatusCodes } = require('http-status-codes');
const User = require('../models/User')
const Faculty=require('../models/Faculty_model')
const Lab = require('../models/Lab')
const sendEmail = require('../utils/sendEmail')
const { BadRequestError, NotFoundError } = require('../error')
const crypto = require('crypto')
const { bcrypt } = require('../utils/passwords')

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
})[character])

const generateRandomPassword = (length = 8) => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%'
    let password = ''
    for (let i = 0; i < length; i++) {
        password += charset[crypto.randomInt(charset.length)]
    }
    return password
}
// module.exports = generateRandomPassword
// POST /faculty/ -> Lab Admin creates a faculty account, optionally assigning a lab.
// A faculty account with an assigned lab is a Lab Incharge.
// The credential-email endpoint issues a fresh password and stores only its hash.
const AddFaculties = async (req, res, next) => {
    try {
        const { name, email, lab_name, lab_id } = req.body

        // if (!name || !email || (!lab_name && !lab_id)) {
        //     throw new BadRequestError('Please provide name, email and a lab assignment')
        // }
        if (!name || !email) {
                throw new BadRequestError(
                'Please provide name and email'
            )
        }

        const existingFaculty = await Faculty.findOne({ email: email.toLowerCase().trim() })
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        })
        if (existingFaculty || existingUser) {
            throw new BadRequestError('A faculty with this email already exists')
        }

        // let selectedLab = null
        // if (lab_id) {
        //     selectedLab = await Lab.findById(lab_id)
        // } else {
        //     selectedLab = await Lab.findOne({ LabName: lab_name })
        // }

        // if (!selectedLab) {
        //     throw new NotFoundError('Selected lab not found')
        // }

        // if (selectedLab.AssignFaculty) {
        //     const assignedFaculty = await Faculty.findById(selectedLab.AssignFaculty)
        //     throw new BadRequestError(`This lab is already assigned to ${assignedFaculty ? assignedFaculty.name : 'another faculty'}`)
        // }
        let selectedLab = null;

if (lab_id || lab_name) {
    if (lab_id) {
        selectedLab = await Lab.findById(lab_id);
    } else {
        selectedLab = await Lab.findOne({ LabName: lab_name });
    }

    if (!selectedLab) {
        throw new NotFoundError('Selected lab not found');
    }

    if (selectedLab.AssignFaculty) {
        const assignedFaculty = await Faculty.findById(
            selectedLab.AssignFaculty
        );

        throw new BadRequestError(
            `This lab is already assigned to ${
                assignedFaculty
                    ? assignedFaculty.name
                    : 'another faculty'
            }`
        );
    }
}

        const password = generateRandomPassword()

        // const faculty = await Faculty.create({
        //     name,
        //     email: email.toLowerCase().trim(),
        //     lab_name: selectedLab.LabName,
        //     lab: selectedLab._id,
        //     password,
        // })
        const faculty = await Faculty.create({
    name,
    email: email.toLowerCase().trim(),
    lab_name: selectedLab ? selectedLab.LabName : null,
    lab: selectedLab ? selectedLab._id : null,
    password: await bcrypt.hash(password, 12),
});

        // selectedLab.AssignFaculty = faculty._id
        // await selectedLab.save()
        if (selectedLab) {
    selectedLab.AssignFaculty = faculty._id;
    await selectedLab.save();
}

        res.status(StatusCodes.CREATED).json({
            message:"Faculty Added Successfully",
            faculty: {
                _id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                lab_name: faculty.lab_name,
                lab: faculty.lab,
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
        const faculties = await Faculty.find({}).select('-password').populate('lab', 'LabName').sort('-createdAt')
        res.status(StatusCodes.OK).json({ faculties, count: faculties.length })
    } catch (error) {
        next(error)
    }
}

// POST /faculty/credentials  -> emails the faculty their login credentials
// body: { email }
const emailCredentials = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) {
            throw new BadRequestError('Please provide an email')
        }

        const faculty = await Faculty.findOne({ email: email.toLowerCase().trim() })
        if (!faculty) {
            throw new NotFoundError('Faculty not found')
        }

        const previousPassword = faculty.password
        const password = generateRandomPassword()
        faculty.password = await bcrypt.hash(password, 12)
        await faculty.save()

        const accountDescription = faculty.lab_name
            ? `a Lab Incharge account for <b>${escapeHtml(faculty.lab_name)}</b>`
            : 'a Faculty account with no assigned lab';

        try {
            await sendEmail({
                to: faculty.email,
                subject: 'Your LabSync Faculty Account Credentials',
                html: `
                    <p>Hello ${escapeHtml(faculty.name)},</p>
                    <p>Your LabSync account has been created as ${accountDescription}.</p>
                    <p>
                        <b>Login email:</b> ${escapeHtml(faculty.email)}<br/>
                        <b>Password:</b> ${escapeHtml(password)}
                    </p>
                    <p>Please log in and change your password after your first login.</p>
                `,
            })
        } catch (error) {
            faculty.password = previousPassword
            await faculty.save()
            throw error
        }

        res.status(StatusCodes.OK).json({ message: `Credentials sent to ${faculty.email}` })
    } catch (error) {
        next(error)
    }
}

// DELETE /faculty/:id -> removes a faculty account and releases its lab
const deleteFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.findByIdAndDelete(req.params.id)

        if (!faculty) {
            throw new NotFoundError('Faculty not found')
        }

        await Lab.updateMany(
            { AssignFaculty: faculty._id },
            { $set: { AssignFaculty: null } }
        )

        res.status(StatusCodes.OK).json({
            faculty: {
                _id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                lab_name: faculty.lab_name,
                lab: faculty.lab,
            },
            message: 'Faculty deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    emailCredentials,
    getFaculties,
    AddFaculties,
    deleteFaculty,
}

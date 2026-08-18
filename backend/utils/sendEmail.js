require('dotenv').config()
const nodemailer = require('nodemailer')

// Requires EMAIL_USER and EMAIL_PASS (an app password, not your normal login
// password if using Gmail) to be set in the backend .env file.
// Optional: EMAIL_SERVICE (defaults to 'gmail').
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})
      
const sendEmail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"LabSync Admin" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    })
}


module.exports = sendEmail
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../error');
const { StatusCodes } = require('http-status-codes');

const verifyAdminToken = (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    console.log('authheader is ', authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication Invalid')
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access Denied. No token provided' });
    }
    //console.log('token is', token)
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to the Notes Route
        console.log('in authentication middleware payload is', payload)
        if (payload.role == 'admin') {
            req.user = payload;
            next()
        }
        else
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access Denied.User is Not Authorized as Admin' });
    }
    catch (error) {
        throw new UnauthenticatedError('Authorization  Invalid')
    }
}
module.exports = verifyAdminToken;
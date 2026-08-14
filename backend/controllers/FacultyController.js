require('dotenv').config()
const Faculty = require("../models/Faculty_model")
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../error')
const getProfileData = async (req, res, next) => {
    try {
   
    } catch (error) {

    }
}
const editProfileData = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const getAssignedLabResources = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const uploadLabManuals = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const raiseComplaints = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const getComplaints = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
module.exports = {
    getProfileData,
    editProfileData,
    getAssignedLabResources,
    uploadLabManuals,
    raiseComplaints,
    getComplaints
};
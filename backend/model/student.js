const mongoose = require('mongoose')
const StudentSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: [true, 'Please provide username'],
    },
    studentId:{
        type: String,
        required: [true, 'Please provide student ID'],
        unique: true
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    branch:{
        type:String,
        // required: true
    },
    semester:{
        type:String,
        // required: true
    },
},
    { timestamps: true }
)
module.exports = mongoose.model('Student', StudentSchema)
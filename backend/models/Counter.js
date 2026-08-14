const mongoose = require('mongoose')

// One document per (labCode + resourceCode) combination, e.g. "F206_RCH".
// `seq` is incremented atomically every time a new asset of that kind is
// added to that lab, so it becomes the serial number in the asset ID
// (BVM/HW/F206/RCH/01, .../02, ...).
const CounterSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model('Counter', CounterSchema)
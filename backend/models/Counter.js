const mongoose = require('mongoose')

// One document per (fundType + labCode + resourceCode) combination, e.g. "GIA_F206_RCH".
// `seq` is incremented atomically every time a new asset of that kind is
// added to that fund and lab, so it becomes the serial number in the asset ID
// (BVM/GIA/HW/F206/RCH/01, .../02, ...).
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
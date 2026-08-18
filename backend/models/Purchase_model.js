const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        particulars: {
            type: String,
            required: true,
            trim: true
        },

        supplierName: {
            type: String,
            required: true,
            trim: true
        },

        billNumber: {
            type: String,
            required: true,
            trim: true
        },

        billDate: {
            type: Date,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitCost: {
            type: Number,
            required: true,
            min: 0
        },

        totalCost: {
            type: Number,
            required: true,
            min: 0
        },

        salesTax: {
            type: Number,
            default: 0,
            min: 0
        },

        freight: {
            type: Number,
            default: 0,
            min: 0
        },

        grandTotal: {
            type: Number,
            required: true,
            min: 0
        },

        billFile: {
            type: String,
            default: null
        },

        signature: {
            type: String,
            default: ""
        },

        remarks: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
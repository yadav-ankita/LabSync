const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
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
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],

    },
    favouriteBooks: [{
        type: mongoose.Types.ObjectId,
        ref: 'Book'
    }],
    cart: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            }
        }
    ],
    orders: [
        {
            // order: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'Order'
            // }

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'

        }
    ]
},
    { timestamps: true }
)
module.exports = mongoose.model('User', UserSchema)
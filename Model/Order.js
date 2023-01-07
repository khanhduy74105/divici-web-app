const mongoose = require('mongoose')

const Order = mongoose.Schema({
    receiver: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,

    },
    phone: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    order: {
        type: Array,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'user'
    },
    state: {
        type: String,
        default: 'waiting'
    },
    total: {
        type: Number
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('order', Order)
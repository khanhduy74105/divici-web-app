const mongoose = require('mongoose')

const Cart = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'product'
    },
    quanlity: {
        type: Number,
        require: true
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('cart', Cart)
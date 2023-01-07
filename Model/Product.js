const mongoose = require('mongoose')

const Product = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    images: {
        type: Array,
    },
    price: {
        type: Number,
    },
    type: {
        type: String,
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('product', Product)
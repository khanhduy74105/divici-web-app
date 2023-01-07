const mongoose = require('mongoose')

const Comment = mongoose.Schema({
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
    rate:{
        type: Number,
        require: true
    },
    content:{
        type: String,
        require: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('comment', Comment)
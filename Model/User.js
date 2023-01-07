const mongoose = require('mongoose')

const UserScheme = mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 20,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        require: true
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: 'https://media.istockphoto.com/id/1309328823/fr/photo/verticale-headshot-de-lemploy%C3%A9-masculin-de-sourire-dans-le-bureau.jpg?b=1&s=170667a&w=0&k=20&c=06zXYGJkKAIeq1sAoSUNftfxBj4Wb5I1fLOTzXB4VjQ='
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('user', UserScheme)
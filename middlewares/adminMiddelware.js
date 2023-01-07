const jwt = require('jsonwebtoken')

const checkAdmin = (req, res, next) =>{
    if (req.role === 'admin') {
        next()
    }else{
        return res.status(403).json({success: false, message: 'Dont have permition!'})
    }
}

module.exports = checkAdmin
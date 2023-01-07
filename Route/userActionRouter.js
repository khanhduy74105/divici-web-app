const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/authMiddleware')
const userController = require('../Controller/userController')
const multer  = require('multer')
const upload = multer({ dest: './public/avatarUpload' })

router.post('/comment/:productId',verifyToken, userController.comment)
router.post('/makeorder', verifyToken,userController.makeOrder)
router.post('/changeinfo', verifyToken,userController.changeInfomation)
router.post('/changepass', verifyToken,userController.changePassword)
router.post('/changeavt', verifyToken, upload.single('avatar'), userController.changeAvt)
module.exports = router
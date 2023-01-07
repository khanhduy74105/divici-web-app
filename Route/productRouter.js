const express = require('express')
const router = express.Router()
const productController = require('../Controller/productController') 
const userController = require('../Controller/userController')
const verifyToken = require('../middlewares/authMiddleware')

router.post('/add/:productId',verifyToken, productController.addToCart)
router.get('/get',verifyToken, productController.getCart)
router.put('/update',verifyToken, productController.update)
router.delete('/delete',verifyToken, productController.delete)
router.get('/getcomments/:productId/:time', userController.getComments)
router.get('/getorders',verifyToken, productController.getOrders)
module.exports = router
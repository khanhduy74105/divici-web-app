const authRouter = require('./authRouter')
const productRouter = require('./productRouter')
const adminRouter = require('./adminRouter')
const productController = require('../Controller/productController')
const userActionRouter = require('./userActionRouter')
const verifyToken = require('../middlewares/authMiddleware')
const userController = require('../Controller/userController')
const nodemailer = require("nodemailer");
const Route = (app)=>{
    app.use('/auth', authRouter)
    app.use('/cart', productRouter)
    app.use('/admin', adminRouter)
    app.use('/user', userActionRouter)
    app.get('/getproduct', productController.getProductsHome)
    app.get('/getproductshop/:page', productController.getProductsShop)
    app.get('/getproduct/:type', productController.getProductsType)
    app.get('/get/:productId', productController.getDetail)
    app.post('/order/changestate/:productId', verifyToken, userController.changeState)
    app.post('/sendmail',async (req, res)=>{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user:   'duyntk74105@gmail.com', // generated ethereal user
            pass: 'bsseobsbfrcemskz', // generated ethereal password
            },
        });

        await transporter.sendMail({
            from: '"duy74105@gmail.com', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: `Davici questions from ${req.body.name}`, // Subject line
            text: `${req.body.questions}`, // plain text body
        }, (err)=>{
            if (!err) {
                res.json({success: true, message: 'Send successfully'})
            }else{
                res.json({success: false, message: 'Send failed'})
    
            }

        });
    })
}

module.exports = Route
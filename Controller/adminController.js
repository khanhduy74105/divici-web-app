const Product = require('../Model/Product')
const Order = require('../Model/Order')
const { unlink } = require('node:fs').promises
class adminController {

    async postProduct(req, res){
        try {
            const listImage = []
            req.files.forEach(file => {
                const imagePath = file.destination.split('/')[2] +'/'+file.filename
                listImage.push(imagePath)
            });
            const newProduct = new Product({
                ...req.body,
                images: listImage
            })
            await newProduct.save()
            res.status(200).json({success: true, message: 'Add product successully'})
        } catch (error) {
            res.status(400).json({success: false, message: 'Add product failed'})
        }
    }

    async updateProduct (req,res){
        try {
            const {_id,...data} = req.body;
            const curProduct = await Product.findOne({_id: _id})
            const files = req.files
            const listImage = curProduct.images
            let updatedImages = []
            let updatedProduct
            if (files.length > 0) {
                listImage.forEach(async imagePath => {
                    await unlink(`./public/${imagePath}`)
                });
                files.forEach(file => {
                const imagePath = file.destination.split('/')[2] +'/'+file.filename
                updatedImages.push(imagePath)
                });
                updatedProduct = await Product.findOneAndUpdate({_id: _id}, {data, images: updatedImages},{new: true} )
                res.json({success:true, updatedProduct})
            }else {
                updatedProduct = await Product.findOneAndUpdate({_id: _id}, {data},{new: true} )
                res.json({success:true, updatedProduct})
            }
        } catch (error) {
            res.json({success:false, message: error})
            
        }
    }
    async confirmOrder(req, res){
        try {
            const order = await Order.findOneAndUpdate({_id: req.params.productId},{state: 'done'},{new: true})
            res.json({success:true, message: 'COnfirm order successully', order})
        } catch (error) {
            res.json({success:false, message: 'COnfirm order failed'})
        }

    }
}

module.exports = new adminController()
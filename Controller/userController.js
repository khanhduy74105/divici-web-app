const Comment = require('../Model/Comment')
const Order = require('../Model/Order')
const Cart = require('../Model/Cart')
const User = require('../Model/User')
const bcrypts = require('bcryptjs')
const { unlink } = require('node:fs/promises')

class userController{
    async comment(req, res){
        try {
            const newComment = new Comment({
                user: req.userId,
                product: req.params.productId,
                ...req.body
            })
            await newComment.save()
            res.json({success: true, message: 'you must commented'})
        } catch (error) {
            res.json({success: false, message: 'Comment failed'})
        }
    }

    async getComments(req, res){
        try {
            const time = req.params.time
            const commentPerTime = 5
            const total = Math.round(await Comment.find({product: req.params.productId}).count() / commentPerTime)
           const data = await Comment.find({product: req.params.productId}).populate({path: 'user', select: 'username'}).limit(5 * time)
           res.json({success: true, comments: data, total})
        } catch (error) {
            res.json({success: false, message: 'Comment failed'})
        }
    }
    async makeOrder(req, res){
        try {
            const order = req.body
            const newOrder = new Order({...order, user: req.userId})
            const x = await newOrder.save()
            const products = req.body.order
            if (x) {
                products.forEach(async product => {
                    await Cart.findOneAndRemove({user: req.userId, product: product._id})
                });
            }
            res.json({success: true, message: 'Make order successfully!'})
        } catch (error) {
            res.json({success: false, message: 'Have a mistake!!'})
            
        }
    }
    async changeInfomation(req, res){
        try {
            const userUpdated = await User.findOneAndUpdate({_id: req.userId}, req.body,{new: true})
            res.json({success:true, userUpdated: userUpdated, message: 'Updated successfully!'})
        } catch (error) {
            res.json({success:false, message:'Updated failed'})
            
        }
    }
    async changePassword(req, res){
        try {
            const user = await User.findOne({_id: req.userId})
            const valid = await bcrypts.compare(req.body.oldpass, user.password);
            if (valid) {
                const salt = await bcrypts.genSalt(10);
                const hashed = await bcrypts.hash(req.body.newpassword, salt);
                const userUpdated = await User.findOneAndUpdate({_id: req.userId}, {password: hashed},{new: true})
                res.json({success:true, message: 'Updated successfully!', valid, userUpdated})
            }else{
                res.json({success:false, message:'Password wroong'})
            }
        } catch (error) {
            res.json({success:false, message:'Updated failed'})
            
        }
    }
    async changeAvt(req, res){
        try {
            const file = req.file
            const imagePath = file.destination.split('/')[2] +'/'+file.filename
            const userA = await User.findOneAndUpdate({_id: req.userId}, {avatar: imagePath})
            try {
                await unlink(`./public/${userA.oldImage}`)
            } catch (error) {
                
            }
            res.json({message: 'Change avatar success', success: true})
        } catch (error) {
            res.json({message: 'Change avatar falied', success: false})
        }
    }

    async changeState(req, res){
        try {
            const order= await Order.findOneAndUpdate({_id: req.params.productId}, {state: req.body.state})
            if (order) {
                res.json({success: true, message: `${req.body.state} successfully`})
            }
        } catch (error) {
            res.json({success: false, message: `Failed`})
            
        }
    }
}

module.exports = new userController()
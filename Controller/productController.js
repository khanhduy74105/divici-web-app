const Product = require("../Model/Product");
const Cart = require("../Model/Cart");
const Comment = require("../Model/Comment");
const Order = require("../Model/Order");

class productController {
  async addToCart(req, res) {
    try {
      const quanlity = req.body.quanlity;
      const product = await Product.findById(req.params.productId);
      if (!product) {
        res.json({ success: false, message: "Product not already exit!" });
      }
      const existProduct = await Cart.findOne({
        product: product._id,
        user: req.userId,
      });
      if (existProduct) {
        const updateCart = {
          quanlity: existProduct.quanlity + parseInt(quanlity),
        };
        const updatedCart = await Cart.findOneAndUpdate(
          {
            _id: existProduct._id,
          },
          updateCart,
          { new: true }
        );
        res.json({
          success: true,
          message: "Add to cart success",
          updatedCart,
        });
      } else {
        const newCart = new Cart({
          user: req.userId,
          product: product._id,
          quanlity: parseInt(quanlity),
        });
        await newCart.save();
        res.json({ success: true, message: "Add to cart success" });
      }
    } catch (error) {
      res.json({ success: false, message: "Add to cart failed" });
    }
  }

  async getDetail(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      const comments = await Comment.find({ product: req.params.productId });
      const rate =
        comments.reduce((total, curr) => total + curr.rate, 0) /
        comments.length;
      const listRate = {
        "1sao": 0,
        "2sao": 0,
        "3sao": 0,
        "4sao": 0,
        "5sao": 0,
      };
      comments.forEach((current) => {
        listRate[`${current.rate}sao`]++;
      });
      listRate["total"] = comments.length;
      listRate["rate"] = rate.toFixed(2);
      if (product) {
        res.json({ success: true, data: product, listRate: listRate });
      }
    } catch (error) {
      res.json({ success: false, message: error });
    }
  }

  async getCart(req, res) {
    try {
      const condition = {
        user: req.userId,
      };
      const product = await Cart.find(condition).populate("product");
      if (!product) {
        res.json({ success: false, message: "Product not already exit!" });
      }
      res.json({ success: true, message: "success", product });
    } catch (error) {
      res.json({ success: false, message: "failed" });
    }
  }

  async delete(req, res) {
    try {
      const product = await Cart.findOne({
        uesr: req.userId,
        product: req.body.productId,
      });
      if (!product) {
        res.json({ success: false, message: "Product not already exit!" });
      }
      const deleteCart = await Cart.findOneAndDelete({ _id: product._id });
      res.json({ success: true, message: "delete success", deleteCart });
    } catch (error) {
      res.json({ success: false, message: "Delete failed" });
    }
  }

  async update(req, res) {
    try {
      const cartCondition = {
        user: req.userId,
        product: req.body.productId,
      };
      const CartData = await Cart.findOne(cartCondition);
      if (!CartData) {
        res.json({ success: false, message: "Product not already exit!" });
      }

      const newCart = {
        quanlity: req.body.quanlity,
      };

      const updatedCart = await Cart.findOneAndUpdate(cartCondition, newCart, {
        new: true,
      });
      res.json({
        success: true,
        message: "Update cart success",
        updatedCart: updatedCart,
      });
    } catch (error) {
      res.json({ success: false, message: "Update failed" });
    }
  }

  async getProducts(req, res) {
    try {
      const productPerPage = 5;
      const page = parseInt(req.params.page);
      const amount = Math.round((await Product.count()) / productPerPage);
      const data = await Product.find()
        .skip((page - 1) * productPerPage)
        .limit(productPerPage);
      res.json({ data, pages: amount });
    } catch (error) {}
  }
  async getProductsShop(req, res) {
    try {
      const productPerPage = 12;
      const page = parseInt(req.params.page);

      const pipeline = [
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "product",
            as: "comments",
          },
        },
        {
          $addFields: {
            rate: {
              $cond: {
                if: { $gt: [{ $size: "$comments" }, 0] },
                then: {
                  $divide: [{ $sum: "$comments.rate" }, { $size: "$comments" }],
                },
                else: 0,
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            type: 1,
            description: 1,
            images: 1,
            rate: { $round: ["$rate", 2] },
          },
        },
        {
          $sort: { rate: -1 },
        },
        {
          $skip: (page - 1) * productPerPage,
        },
        {
          $limit: productPerPage,
        },
      ];

      const products = await Product.aggregate(pipeline);
      const amount = Math.ceil((await Product.count()) / productPerPage);

      res.json({ data: products, pages: amount });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
  // async getProductsShop (req, res){
  //     try {
  //         const productPerPage = 12
  //         const page = parseInt(req.params.page)
  //         const amount = Math.round(await Product.count() / productPerPage)
  //         const data = await Product.find().skip((page - 1) * productPerPage).limit(productPerPage)

  //         const list = data.map(currentProduct => {
  //             const prm = new Promise(async (resolve, reject)=>{
  //                 const comments =await Comment.find({product: currentProduct._id})
  //                 if (comments) {
  //                     let rate = 0
  //                     const length = comments.length || 1
  //                     rate = comments.reduce((total, curr)=> total + curr.rate, 0) / length
  //                     const data = {product: currentProduct._id,rate: rate.toFixed(2)}
  //                     resolve(data)
  //                 }else{
  //                     reject('asda')
  //                 }
  //             })
  //             return prm

  //         })
  //         const values = await Promise.all(list)
  //         const productDatas = data.map((curr)=>{
  //             const product = {
  //                 _id: curr._id,
  //                 price: curr.price,
  //                 type: curr.type,
  //                 description: curr.description,
  //                 name: curr.name,
  //                 images: curr.images
  //             }
  //             product['rate'] = values.find(value => value.product === curr._id).rate
  //             return product
  //         })
  //         res.json({data: productDatas, pages: amount})
  //     } catch (error) {

  //     }
  // }

  async getProductsType(req, res) {
    try {
      const productPerPage = 12;
      const data = await Product.find({ type: req.params.type }).limit(
        productPerPage
      );
      res.json({ success: true, data });
    } catch (error) {}
  }

  async getProductsHome(req, res) {
    try {
      const data = await Product.find().limit(12);
      res.json({ data });
    } catch (error) {
      res.status(200).json({ error });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await Order.find({ user: req.userId });
      res.json({ success: true, orders: orders });
    } catch (error) {
      res.json({ success: false, message: "Get orders failed" });
    }
  }

  async getOrdersAll(req, res) {
    try {
      const orders = await Order.find({});
      res.json({ success: true, orders: orders });
    } catch (error) {
      res.json({ success: false, message: "Get orders failed" });
    }
  }
}

module.exports = new productController();

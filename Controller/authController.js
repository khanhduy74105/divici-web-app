const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const bcrypts = require('bcryptjs')
class authController {
  async register(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: " Missing Username or password",
      });
    }
    try {
      const user = await User.findOne({ username });
      if (user){
        return res.status(400).json({
          success: false,
          message: "Already username",
        });
      }

      const salt = await bcrypts.genSalt(10);
      const hashed = await bcrypts.hash(password, salt);
      User.create({
        username: username,
        password: hashed,
        address: req.body.address || "",
        phone: req.body.phone || "",
    }, function (err, user) {
        if (err) {
            console.log("Error creating User: ", err);
            res
                .status(400)
                .json(err)
        } else {
          const accessToken = jwt.sign(
            {
              userId: newUser._id,
              role: newUser.role
            },
            process.env.ASSCESS_SECRET_KEY
          );
          res
            .status(200)
            .json({
              accessToken,
              success: true,
              message: "Register account successfully!"
            });
            res
            .status(201)
            .json(user)
        }
    })
      
    } catch (error) {
      res.status(500).json({ success: false, message: "Failled register!" , error: error});
    }
  }

  async login (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: " Missing Username or password",
      });
    }

    try {
      const user = await User.findOne({ username });
      if (!user)
        return res.status(403).json({
          success: false,
          message: "User not found",
        });
        const valid = await bcrypts.compare(password, user.password);
        if (!valid) {
            res.status(403).json({succes: false, message:'invalid password'})
        }
          
        if (valid && user) {
          const accessToken = jwt.sign(
            {
              userId: user._id,
              role: user.role || 'user'
            },
            process.env.ASSCESS_SECRET_KEY
          );
          res 
            .status(200)
            .json({
              accessToken,
              success: true,
              message: "Login successfully!"
            });
        }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failled Login!" , error: error});
    }
  }

  async findUser(req, res){
    try {
      const user = await User.findById(req.userId);
      if (user) {
        res.status(200).json({success: true, message: 'Authenticated user', user})
      }else{
        res.status(400).json({success: false, message: 'not found user'})
      }
    } catch (error) {
      res.status(400).json({success: false, message: error})
    }
  }
}

module.exports = new authController();

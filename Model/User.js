const mongoose = require("mongoose");

const UserScheme = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      minlength: 6,
      maxlength: 20,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      require: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: "avatarUpload/73cebd4fa40fb41710b020019768dfea",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserScheme);

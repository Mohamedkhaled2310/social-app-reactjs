const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    location: {
      type: String,
      default: '',
    },
    work: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    user_type: {
      type: String,
      default: 'user',
    },

  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;

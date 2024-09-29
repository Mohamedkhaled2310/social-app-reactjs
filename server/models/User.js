const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
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
    address: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: 'male'
    },
    website: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: ''
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;

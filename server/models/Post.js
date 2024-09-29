const mongoose = require("mongoose");

const PostSchema =new mongoose.Schema(
  {
    content: String,
    images:{
        type:Array,
        required:true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes:[{type:mongoose.Types.ObjectId, ref:'User' }],
    comments:[{type:mongoose.Types.ObjectId, ref:'Comment' }],
    user:{type:mongoose.Types.ObjectId, ref:'User'}
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

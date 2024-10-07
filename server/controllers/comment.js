const Post = require('../models/Post.js');
const User = require('../models/User.js');
const { v4: uuidv4 } = require('uuid'); // for unique commentID
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;


  try {
    const post = await Post.findById(postId);
    if (!post) 
    {
   return res.status(404).json({ message: "Post not found" });
    }
    const user= await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const commentId = uuidv4();

    const newComment = {
      commentId,
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
      comment,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update a comment
const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { editComment } = req.body;
  // console.log(editComment);
  try {
    const post = await Post.findById(postId);
    const comment = post.comments.find(c => c.commentId === commentId);
    console.log(comment);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    comment.comment = editComment;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments = post.comments.filter(comment => comment.commentId.toString() !== commentId);

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  addComment,
  updateComment,
  deleteComment,
};

const Post = require('../models/Post.js');

// Add a comment
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;
console.log(comment);

  try {
    const post = await Post.findById(postId);
    post.comments.push({ userId, comment });
    await post.save();

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found." });

    comment.text = text;
    await post.save();

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    post.comments.id(commentId).remove();
    await post.save();

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
};

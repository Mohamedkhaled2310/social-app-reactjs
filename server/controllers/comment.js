const Post = require('../models/Post.js');
const { v4: uuidv4 } = require('uuid'); // for unique commentID

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  console.log(comment);

  try {
    const post = await Post.findById(postId);
    const commentId = uuidv4();
    post.comments.push({ commentId, userId, comment });
    await post.save();

    res.status(201).json(post);
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

    // Filter out the comment with the matching commentId
    post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

    // Save the updated post after the comment is removed
    await post.save();

    res.status(200).json(post); // Respond with the updated post
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  addComment,
  updateComment,
  deleteComment,
};

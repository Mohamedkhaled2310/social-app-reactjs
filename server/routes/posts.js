const express = require('express');
const { getFeedPosts, getUserPosts, likePost,deletePost, likeComment } = require('../controllers/posts.js');
const { verifyToken } = require("../middleware/auth.js");
const {addComment,updateComment,deleteComment} = require('../controllers/comment.js')
const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
/* Comment */
router.delete("/:postId", verifyToken,deletePost);
router.post('/:postId/comment', verifyToken, addComment);
router.route('/:postId/comment/:commentId')
    .patch(verifyToken, updateComment)
    .delete(verifyToken, deleteComment);    

router.patch('/:postId/comment/:commentId/like',verifyToken, likeComment);    
module.exports = router;

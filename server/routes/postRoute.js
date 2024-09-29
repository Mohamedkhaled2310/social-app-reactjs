const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/auth');

const { addPost,
    getPost,
    updatePost,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    getSavedPost,
    // getUserPosts,
    // getSinglePost,
    deletePost, } = require('../controllers/postCtrl');

router.route('/post')
    .post(verifyToken, addPost)
    .get(verifyToken, getPost);

router.route('/post/:id')
    .patch(verifyToken, updatePost)
    .delete(verifyToken, deletePost);
    
router.patch('/post/:id/like',verifyToken, likePost);

router.patch('/post/:id/unlike',verifyToken, unlikePost);

router.patch('/savePost/:id',verifyToken,savePost);

router.patch('/unSavePost/:id',verifyToken,unsavePost);

router.get('/savedpost',verifyToken, getSavedPost);




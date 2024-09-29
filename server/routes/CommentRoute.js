const express=require('express');

const router=express.Router();

const { addComment,
    updateComment,
    likeComment,
    unlikeComment,
    deleteComment,}=require('../controllers/commentCtrl');

const {verifyToken}=require('../middleware/auth');

router.post('/comment', verifyToken, addComment);

router.route('/comment/:id')
        .patch(verifyToken, updateComment)
        .delete( verifyToken, deleteComment);

        router.patch('/comment/:id/like', verifyToken,likeComment);

        router.patch('/comment/:id/unlike', verifyToken, unlikeComment);


module.exports=router;

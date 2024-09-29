const Comment = require('../models/comment');

const Posts = require('../models/Post');

const appError=require('../helpers/AppError')

const httpHandeler=require("../helpers/httpStatusCode");
const { updateComment } = require('./comment');


const addComment = async (req, res,next) => {
 try{
    const {content, postId, tag, reply, postUserId} = req.body;

    const post=await Posts.findById(postId);

    if(!post){
        const error = appError.create('no post added yet',400,httpHandeler.FAILUER);
       
        next(error);
    }
    
    const newComment = new Comment({
        user:req.user.id,
        content,
        postId,
        tag,
        reply,
        postUserId
    })
    
    await Posts.findOneAndUpdate({_id:postId},{
        
        $push:{comments:newComment._id}
    });
    
    await newComment.save();
    
    res.status(200).json({
        
        status:httpHandeler.SUCCESS,

        data:newComment
    })

}catch(err){

    const error=appError.create('make some Wrong',500,httpHandeler.ERROR);

    next(error);
 }
};

const updateComment=async(req, res,next)=>{
try{
    const {content}=req.body;

    await Comment.findOneAndUpdate({_id: req.params.id, user:req.user._id},{content})
    
    res.status(200).json({
        status:httpHandeler.SUCCESS,
        message:'comment updated successfully'
    });

}catch(err){

    const error=appError.create('make some Wrong',500,httpHandeler.ERROR);

next(error);
}
};

const likeComment = async (req, res, next) => {
    try {
      const comment = await Comment.findOne({ _id: req.params.id, likes: req.user._id });
  
      if (comment) {
        return res.status(400).json({
          status: httpHandeler.FAILURE,
          message: 'You already liked this comment',
        });
      }
  
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.user._id } },
        { new: true }
      );
  
      res.status(200).json({
        status: httpHandeler.SUCCESS,
        message: 'Comment liked successfully',
      });

    } catch (err) {
      const error = appError.create(
        'Something went wrong', 
        500, 
        httpHandeler.ERROR
    );
      
      next(error);
    }

  };
  
  const unlikeComment = async (req, res, next) => {
    
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );
  
      res.status(200).json({
        status: httpHandeler.SUCCESS,
        message: 'Comment unliked successfully',
      });

    } catch (err) {
      const error = appError.create(
        'Something went wrong',
         500, 
         httpHandeler.ERROR
        );
      next(error);
    }
  };
  

  const deleteComment = async (req, res, next) => {
    
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: 
        [{ postUserId: req.user._id }, 
        { user: req.user._id }],
      });
  
      if (!comment) {
        return res.status(404).json({
          status: httpHandeler.FAILURE,
          message: 'Comment not found or not authorized',
        });
      }
  
      await Posts.findOneAndUpdate(
        { _id: comment.postId }, 
        { $pull: { comments: req.params.id } 
    });
  
      res.status(200).json({
        status: httpHandeler.SUCCESS,
        message: 'Comment deleted successfully',
      });
      
    } catch (err) {
      const error = appError.create(
        'Something went wrong', 
         500, 
         httpHandeler.ERROR);
      next(error);
    }
  };
module.exports={
    addComment,
    updateComment,
    likeComment,
    unlikeComment,
    deleteComment,
}
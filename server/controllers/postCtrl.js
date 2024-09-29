const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/comment');
const appError = require('../helpers/AppError');
const httpHandler = require("../helpers/httpStatusCode");

const addPost = async (req, res, next) => {
    try {
        const { content, images } = req.body;

        if (images.length === 0) {
            return next(appError.create('Add a photo', 400));
        }
        const newPost = new Post({
            content,
            images,
            user: req.user.id
        });

        await newPost.save();

        res.status(200).json({
            status: httpHandler.SUCCESS,
            message: 'Post added successfully',
            data: newPost
        });
    } catch (err) {
        next(appError.create('Some error occurred', 500));
    }
};

const getPost = async (req, res, next) => {
    try {
        const posts = await Post.find({ user: [...req.user.following, req.user._id] })
            .sort("-createdAt")
            .populate("user likes", "username picturePath")
            .populate({
                path: "comments",
                populate: {
                    path: "User likes",
                    select: "-password"
                }
            });

        return res.status(200).json({
            message: 'Posts found',
            posts
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { content, images } = req.body;
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { content, images },
            { new: true }
        ).populate("User likes", "username picturePath");

        if (!post) {
            return next(appError.create('Post not found', 404));
        }

        return res.status(200).json({
            message: "Post updated",
            newPost:post 
    });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const likePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, likes: req.user._id });

        if (post.length > 0) {
            return next(appError.create("You have already liked this post", 400));
        }

        const like = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { likes: req.user._id } },
            { new: true }
        );

        if (!like) {
            return next(appError.create("No post found", 404));
        }

        return res.status(200).json({
            message: "Post liked",
            status: httpHandler.SUCCESS
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const unlikePost = async (req, res, next) => {
    try {
        const unlike = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { likes: req.user._id } },
            { new: true }
        );

        if (!unlike) {
            return next(appError.create("No post found", 404));
        }

        return res.status(200).json({
            status: httpHandler.SUCCESS,
            message: "Post unliked"
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const savePost = async (req, res, next) => {
    try {
        const user = await User.find({ _id: req.user._id, saved: req.params.id });

        if (user.length > 0) {
            return next(appError.create("You have already saved this post", 400));
        }

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { saved: req.params.id } },
            { new: true }
        );

        return res.status(200).json({ 
            status: httpHandler.SUCCESS,
            message: "Post saved"
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const unsavePost = async (req, res, next) => {
    try {
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $pull: { saved: req.params.id } },
            { new: true }
        );

        return res.status(200).json({
            status: httpHandler.SUCCESS,
            message: "Post unsaved"
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const getSavedPost = async (req, res, next) => {
    try {
        const savedPosts = await Post.find({ _id: { $in: req.user.saved } })
            .sort("-createdAt")
            .populate("user likes", "username picturePath");

        return res.status(200).json({
            message: "Saved posts retrieved successfully",
            savedPosts
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const getUserPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ user: req.params.id }).sort("-createdAt")
            .populate("user likes", "username picturePath")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            });

        return res.status(200).json({
            message: 'User posts found',
            posts
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const getSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user likes", "username picturePath")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            });

        if (!post) {
            return next(appError.create('Post not found', 404));
        }

        return res.status(200).json({
            post
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!post) {
            return next(appError.create('Post not found', 404));
        }
        await Comment.deleteMany({ _id: { $in: post.comments } });

        return res.status(200).json({
            message: "Post deleted",
            deletedPost: post
        });
    } catch (err) {
        return next(appError.create('Some error occurred', 500));
    }
};

module.exports = {
    addPost,
    getPost,
    updatePost,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    getSavedPost,
    getUserPosts,
    getSinglePost,
    deletePost,
};

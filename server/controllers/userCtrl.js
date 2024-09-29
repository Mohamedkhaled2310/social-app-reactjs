const User = require('../models/User');
const appError = require('../helpers/AppError');

const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
            .select("-password").populate("friends following", "-password");

        if (!user) {
            const error = appError.create('No user exists', 400);
            return next(error);
        }
        res.status(200).json({ user });
    } catch (err) {
        const error = appError.create('An error occurred', 500);
        next(error);
    }
};

const EditProfile = async (req, res, next) => {
    try {
        const { website, phone, address, firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            const error = appError.create('Full name is required', 400);
            return next(error);
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { website, firstName, lastName, phone, address },
            { new: true }
        );
        if (!user) {
            return next(appError.create('User not found', 404));
        }
        res.status(200).json({ message: 'Update success', user });
    } catch (err) {
        const error = appError.create('An error occurred', 500);
        next(error);
    }
};

const addFriend = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, friends: req.user._id });
        if (user) return res.status(400).json({ message: "You have already followed" });

        const newUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { friends: req.user._id } },
            { new: true }
        ).populate("friends following", "-password");

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { following: req.params.id } },
            { new: true }
        );

        res.json({ newUser });
    } catch (err) {
        const error = appError.create('An error occurred', 500);
        next(error);
    }
};

const unFriend = async (req, res, next) => {
    try {
        const newUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { friends: req.user._id } },
            { new: true }
        ).populate("friends following", "-password");

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $pull: { following: req.params.id } },
            { new: true }
        );

        res.json({ newUser });
    } catch (err) {
        const error = appError.create('An error occurred', 500);
        next(error);
    }
};

const searchUser = async (req, res, next) => {
    try {
        const users = await User.find({ username: { $regex: req.query.username } })
            .limit(10)
            .select("firstName lastName username picturePath");

        res.json({ users });
    } catch (err) {
        const error = appError.create('An error occurred', 500);
        next(error);
    }
};

module.exports = {
    getUser,
    EditProfile,
    addFriend,
    unFriend,
    searchUser,
};

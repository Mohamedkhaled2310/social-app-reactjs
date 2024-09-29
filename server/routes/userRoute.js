const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/auth');
const {  getUser,
    EditProfile,
    addFriend,
    unFriend,
    searchUser,}=require('../controllers/userCtrl');
router.get('/search',verifyToken,searchUser)

router.get('/user/:id',verifyToken,getUser)

router.patch('/user',verifyToken,EditProfile)

router.patch('/user/:id/addFriend',verifyToken,addFriend)

router.patch('/user/:id/unFriend',verifyToken,unFriend)

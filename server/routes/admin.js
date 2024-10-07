const express = require('express');
const router = express.Router();
const {
    viewLogIn,
    viewRegister,
    viewDashboard,
    viewPosts,
    deletePost,
    showPostComments,
    viewUsers,
    deleteUser,
    viewProfile,
    viewSettings,
    logIn,
    signUp,
    logOut,
} = require("../controllers/viewControllers/user");
const { authMiddleware } = require("../middleware/authAdmin");

// Public routes
router.route('/register')
    .get(viewRegister)
    .post(signUp);

router.route('/')
    .get(viewLogIn)
    .post(logIn);

// Apply authMiddleware for all subsequent routes
router.use(authMiddleware);

// Protected routes
router.get('/dashboard', viewDashboard);
router.get('/profile', viewProfile);
router.get('/settings', viewSettings);
router.get('/logout', logOut);

// Routes for posts page
router.get('/posts', viewPosts);
router.get('/posts/delete/:postId', deletePost);
router.get('/posts/showPostComments/:postId', showPostComments);

// Routes for users page
router.get('/users', viewUsers);
router.get('/users/delete/:userId', deleteUser);

module.exports = router;

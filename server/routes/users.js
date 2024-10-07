const express = require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserInfo,
  searchUser
} = require("../controllers/users.js");
const { verifyToken } = require("../middleware/auth.js");

const router = express.Router();
/*search*/
router.get('/search', verifyToken, searchUser);

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id", verifyToken, updateUserInfo);





module.exports = router;

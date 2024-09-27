import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
// axois
const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState(""); // Track the new comment
  const [editCommentId, setEditCommentId] = useState(null); // Track the comment being edited
  const [editComment, setEditComment] = useState(""); // Track the content of the comment being edited
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return; // Prevent empty comments

    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment(""); // Clear the input after submission
  };

  const handleEditSubmit = async (commentId) => {
    if (editComment.trim() === "") return; // Prevent empty edits

    const response = await fetch(`http://localhost:3001/posts/${postId}/comment/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: editComment }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setEditCommentId(null); // Exit edit mode
    setEditComment(""); // Clear the edit input
  };

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${comment.userId}-${i}`}>
              <Divider />
              {editCommentId === comment._id ? (
                <Box display="flex" gap="0.5rem" alignItems="center" mt="0.5rem">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditSubmit(comment.commentId)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditCommentId(null)} // Cancel editing
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment.comment}
                  </Typography>
                  {comment.userId === loggedInUserId && (
                    <Box display="flex" gap="0.5rem" mt="0.25rem">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setEditCommentId(comment.commentId);
                          setEditComment(comment.comment); // Set the current comment in the input for editing
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}
          <Divider />

          {/* New Comment Input */}
          <Box mt="1rem" display="flex" gap="0.5rem" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)} // Update state on input change
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
            >
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;

import axios from "axios";
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
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const patchLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${postId}/like`,
        { userId: loggedInUserId },
        axiosConfig
      );
      dispatch(setPost({ post: response.data }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3001/posts/${postId}/comment`,
          { userId: loggedInUserId, comment: newComment },
          axiosConfig
        );
        dispatch(setPost({ post: response.data }));
        setNewComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const handleEditSubmit = async (commentId) => {
    if (editComment.trim()) {
      try {
        const response = await axios.patch(
          `http://localhost:3001/posts/${postId}/comment/${commentId}`,
          { userId: loggedInUserId, editComment },
          axiosConfig
        );
        dispatch(setPost({ post: response.data }));
        setEditCommentId(null);
        setEditComment("");
      } catch (error) {
        console.error("Error editing comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/posts/${postId}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId: loggedInUserId },
        }
      );
      dispatch(setPost({ post: response.data }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
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
            <IconButton onClick={() => setIsComments((prev) => !prev)}>
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
          {comments.map((comment) => (
            <Box key={comment.commentId}>
              <Divider />
              {editCommentId === comment.commentId ? (
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
                    onClick={() => setEditCommentId(null)}
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
                          setEditComment(comment.comment);
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
          <Box mt="1rem" display="flex" gap="0.5rem" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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

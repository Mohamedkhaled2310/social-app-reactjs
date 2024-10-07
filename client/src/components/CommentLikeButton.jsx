
import { useDispatch, useSelector } from "react-redux";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import axios from "axios";
import { setPost } from "state";
import FlexBetween from "./FlexBetween";

const CommentLikeButton = ({ commentId, postId, likes }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);

    const isCommentLiked = Boolean(likes[loggedInUserId]);
    const commentLikeCount = Object.keys(likes).length;

    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const patchLikeComment = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:3001/posts/${postId}/comment/${commentId}/like`,
                { userId: loggedInUserId },
                axiosConfig
            );
            dispatch(setPost({ post: response.data }));
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    return (
        <>
            <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLikeComment}>
                    {isCommentLiked ? (
                        <FavoriteOutlined sx={{ color: "red" }} />
                    ) : (
                        <FavoriteBorderOutlined />
                    )}
                </IconButton>
                {commentLikeCount > 0 && <Typography>{commentLikeCount}</Typography>}
            </FlexBetween>

        </>
    );
};

export default CommentLikeButton;

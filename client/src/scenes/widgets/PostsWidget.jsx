import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [comments, setComments] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data.comments);
      dispatch(setPosts({ posts: response.data }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPosts({ posts: response.data }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, userId, dispatch, token]); // Added dependencies

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;

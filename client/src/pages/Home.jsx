import { useEffect, useState } from "react";
import { getPosts } from "../api/auth.js";
import { Post } from "../components/Post.jsx";
import { useAuth } from "../components/AuthContext.jsx";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const { accessToken } = useAuth();
  const handleToggleLike = (postId, liked, likesCount) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByCurrentUser: liked,
              _count: { ...post._count, likes: likesCount },
            }
          : post
      )
    );
  };

  useEffect(() => {
    if (!accessToken) return;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getPosts();
        setPosts(res.data);
      } catch (error) {
        setError("Failed to load posts.");
        console.error("Fetch posts error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!posts.length) return <p>No posts available.</p>;

  return (
    <div className="p-4 flex flex-col max-w-md md:max-w-xl xl:max-w-3xl w-full justify-center">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onToggleLike={handleToggleLike}
          activeCommentsPostId={activeCommentsPostId}
          setActiveCommentsPostId={setActiveCommentsPostId}
          underline={true}
        />
      ))}
    </div>
  );
};

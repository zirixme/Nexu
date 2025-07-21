import { useEffect, useState } from "react";
import { getPosts } from "../api/auth.js";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <div key={post.id} className="mb-6 border p-4 rounded shadow">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={post.user.avatar_url || "/default-avatar.png"}
              alt={post.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-semibold">{post.user.username}</p>
          </div>
          {post.text && <p className="mb-2">{post.text}</p>}
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post image"
              className="max-h-60 w-full object-contain"
            />
          )}
          <p className="text-gray-400 text-sm">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

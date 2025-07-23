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
    <div className="p-4 flex flex-col max-w-md md:max-w-2xl xl:max-w-3xl w-full justify-center">
      {posts.map((post) => (
        <div key={post.id} className="mb-6 p-4 border-b border-gray-400">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={post.user.avatar_url || "/default-avatar.png"}
              alt={post.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-semibold">{post.user.username}</p>
          </div>
          {post.image_url && (
            <div className="mb-2 w-full aspect-square">
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {post.text && <p className="mb-2">{post.text}</p>}
          <p className="text-gray-400 text-sm">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

import { useEffect, useState } from "react";
import { getPosts } from "../api/auth.js";
import { MessageCircle, Heart } from "lucide-react";

const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

  if (years > 0) return `${years}y`;
  if (months > 0) return `${months}mo`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

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
        <div key={post.id} className="mb-6  border-b border-gray-400 space-y-2">
          <div className="flex items-center gap-4 mb-2">
            <a
              href={`/profile/${post.user.id}`}
              className="flex items-center gap-2"
            >
              <img
                src={post.user.avatar_url || "/default-avatar.png"}
                alt={post.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold">{post.user.username}</p>
            </a>
            <p className="text-gray-400 text-sm">
              {"· " + getRelativeTime(post.created_at)}
            </p>
          </div>

          {post.image_url && (
            <div className="mb-4 w-full aspect-square">
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="space-x-2 w-full flex">
            <button className="flex gap-2">
              <Heart />
              {post._count.likes}
            </button>
            <button className="flex gap-2">
              <MessageCircle />
              {post._count.comments}
            </button>
          </div>
          {post.user.username && (
            <div className="flex gap-4 mb-4">
              <p className="font-bold">{post.user.username}</p>
              <p>{post.text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

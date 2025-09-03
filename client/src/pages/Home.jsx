import { useEffect, useState } from "react";
import { getPosts, getFollowingPosts } from "../api/auth.js";
import { Post } from "../components/Post.jsx";
import { useAuth } from "../components/AuthContext.jsx";
export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [following, setFollowing] = useState(false);
  const [explore, setExplore] = useState(true);
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

  useEffect(() => {
    if (!accessToken) return;
    const fetchFollowingPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getFollowingPosts();
        setFollowingPosts(res.data);
      } catch (error) {
        setError("Failed to load posts.");
        console.error("Fetch posts error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowingPosts();
  }, [following]);

  if (loading)
    return (
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin top-5 absolute "></div>
    );
  if (error) return <p className="text-red-600">{error}</p>;
  if (!posts.length) return <p>No posts available.</p>;

  return (
    <div className="p-4 flex flex-col max-w-md md:max-w-xl xl:max-w-3xl w-full justify-center dark:bg-gray-950 dark:text-white">
      <ul className="w-full flex justify-center">
        <li
          className={` dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 ${
            explore
              ? "border-b-2 font-bold"
              : "dark:text-gray-400 text-gray-700"
          }`}
        >
          <button
            className="cursor-pointer px-6 py-3"
            onClick={() => {
              setFollowing(false);
              setExplore(true);
            }}
          >
            Explore
          </button>
        </li>
        <li
          className={`  dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 ${
            following
              ? "border-b-2 font-bold dark:text-gray-50"
              : " dark:text-gray-400 text-gray-700"
          }`}
        >
          <button
            className="cursor-pointer px-6 py-3"
            onClick={() => {
              setFollowing(true);
              setExplore(false);
            }}
          >
            Following
          </button>
        </li>
      </ul>
      {explore &&
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onToggleLike={handleToggleLike}
            activeCommentsPostId={activeCommentsPostId}
            setActiveCommentsPostId={setActiveCommentsPostId}
            underline={true}
          />
        ))}

      {following &&
        followingPosts.map((post) => (
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

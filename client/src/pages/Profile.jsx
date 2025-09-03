import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser, getPost, followUser, unfollowUser } from "../api/auth.js";
import { Edit, XIcon, Ellipsis } from "lucide-react";
import { EditProfile } from "../components/EditProfile.jsx";
import { Post } from "../components/Post.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import { PostOptions } from "../components/PostOptions.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleEditProfile, setToggleEditProfile] = useState(false);
  const [options, setOptions] = useState(false);
  // Modal post state
  const [postId, setPostId] = useState(null);
  const [postText, setPostText] = useState(null);
  const [post, setPost] = useState(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

  const { user: loggedInUser } = useAuth();

  const onPostDeleted = (id) => {
    setUser((prev) =>
      prev ? { ...prev, posts: prev.posts.filter((p) => p.id !== id) } : prev
    );
    if (post?.id === id) {
      setPost(null);
      setPostId(null);
      setOptions(false);
    }
  };
  // Fetch user data
  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError("");

    getUser(username)
      .then((res) => setUser(res.data))
      .catch(() => setError("User not found or server error"))
      .finally(() => setLoading(false));
  }, [username]);

  // Fetch single post for modal
  useEffect(() => {
    if (!postId) return;

    setPost(null);
    getPost(postId)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  }, [postId]);

  // Follow/unfollow handler
  const handleFollow = async () => {
    try {
      const updatedUser = isFollowing
        ? await unfollowUser(user.id)
        : await followUser(user.id);
      setUser(updatedUser.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle like for modal post
  const handleToggleLike = (postId, liked, likesCount) => {
    // just update the single post object
    setPost((prev) =>
      prev && prev.id === postId
        ? {
            ...prev,
            likedByCurrentUser: liked,
            _count: { ...prev._count, likes: likesCount },
          }
        : prev
    );
  };

  if (loading)
    return (
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin top-5 absolute"></div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data</p>;

  const followerIds = user.followers.map((f) => f.follower?.id).filter(Boolean);
  const isFollowing = followerIds.includes(loggedInUser?.id);
  const isOwnProfile = loggedInUser?.id === user?.id;

  return (
    <div className="w-full p-4 md:p-6 max-w-md md:max-w-xl xl:max-w-3xl">
      {/* Modal Post */}
      {options && (
        <PostOptions
          Close={() => setOptions(false)}
          postId={postId}
          username={username}
          postText={postText}
          onPostDeleted={onPostDeleted}
        />
      )}
      {post && (
        <div className="fixed inset-0 bg-black/20 z-10 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md w-full md:max-w-xl xl:max-w-2xl bg-gray-50 dark:bg-black dark:text-white px-4 py-4 rounded relative h-fit overflow-y-auto">
            <button
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setPost(null);
                setPostId(null);
              }}
            >
              <XIcon />
            </button>
            {isOwnProfile && (
              <button
                className="absolute top-4 right-16 cursor-pointer"
                onClick={() => setOptions(!false)}
              >
                <Ellipsis />
              </button>
            )}

            <Post
              post={post}
              onToggleLike={handleToggleLike}
              activeCommentsPostId={activeCommentsPostId}
              setActiveCommentsPostId={setActiveCommentsPostId}
              underline={false}
            />
          </div>
        </div>
      )}

      {/* Profile Info */}
      <div className="flex justify-between items-start border-b border-gray-400 dark:border-gray-600 pb-4 relative">
        <div className="space-y-2 w-full">
          <div className="bg-gray-50 w-fit rounded-full mb-4">
            <img
              src={user.avatar_url}
              alt={`${user.username} profile pic`}
              className="w-18 h-18 rounded-full md:w-20 md:h-20 xl:w-24 xl:h-24 border border-gray-50"
            />
          </div>
          <div className="space-y-2 w-full">
            <h1 className="font-bold text-xl">{user.username}</h1>
            <p>{user.bio}</p>
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-4">
                <p>
                  {user.followers.length}{" "}
                  <span className="text-gray-400">followers</span>
                </p>
                <p>
                  {user.following.length}{" "}
                  <span className="text-gray-400">following</span>
                </p>
                <p>
                  {user.posts.length}{" "}
                  <span className="text-gray-400">
                    {user.posts.length === 1 ? "Post" : "Posts"}
                  </span>
                </p>
              </div>

              {!isOwnProfile && (
                <button
                  className="px-4 py-2 bg-black text-white rounded cursor-pointer transition self-end dark:bg-white dark:text-black"
                  onClick={handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <button
            className="hover:cursor-pointer absolute right-0"
            onClick={() => setToggleEditProfile(!toggleEditProfile)}
          >
            <Edit />
          </button>
        )}
      </div>

      {/* User Posts */}
      <div className="mt-6">
        {user.posts?.length ? (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {user.posts.map((p) => (
              <div
                key={p.id}
                className="aspect-square overflow-hidden rounded bg-gray-100 hover:opacity-90 cursor-pointer"
                onClick={() => {
                  setPostId(p.id);
                  setPostText(p.text);
                }}
              >
                <img
                  src={p.image_url || "/fallback.jpg"}
                  alt={`Post by ${user.username}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>

      {toggleEditProfile && (
        <EditProfile onClose={() => setToggleEditProfile(false)} />
      )}
    </div>
  );
};

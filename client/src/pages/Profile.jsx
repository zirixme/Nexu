import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../api/auth.js";
import { Edit } from "lucide-react";
import { EditProfile } from "../components/EditProfile.jsx";
import { Post } from "../components/Post.jsx";
import { getPost, followUser, unfollowUser } from "../api/auth.js";
import { XIcon } from "lucide-react";
import { useAuth } from "../components/AuthContext.jsx";

export const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);
  const [postId, setPostId] = useState(null);
  const [post, setPost] = useState(null);
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError("");

    getUser(username)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError("User not found or server error");
      })
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!postId) return;

    setPost(null);

    getPost(postId)
      .then((res) => setPost(res.data))
      .catch((error) => console.error(error));
  }, [postId]);

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

  if (loading)
    return (
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin top-5 absolute"></div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data</p>;
  const followerIds = user.followers.map((f) => f.follower?.id).filter(Boolean); // remove undefined
  const isFollowing = followerIds.includes(loggedInUser?.id);
  const isOwnProfile = loggedInUser?.id === user?.id;

  return (
    <div className="w-full p-4 md:p-6 max-w-md md:max-w-xl xl:max-w-3xl">
      {/* if post */}
      {post && (
        <div className="fixed inset-0 bg-black/20 z-10 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md md:max-w-xl xl:max-w-2xl 2xl:max-w-4xl bg-gray-50 px-4 py-4 rounded relative  ">
            <button
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setPost(null);
                setPostId(null);
              }}
            >
              <XIcon />
            </button>
            <Post post={post} underline={false} />
          </div>
        </div>
      )}
      {/* Profile Info */}
      <div className="flex justify-between items-start border-b border-gray-400 pb-4 relative">
        <div className="space-y-2 w-full">
          <img
            src={user.avatar_url}
            alt={`${user.username} profile pic`}
            className="w-18 h-18 rounded-full md:w-20 md:h-20 xl:w-24 xl:h-24"
          />
          <div className=" space-y-2 w-full">
            <h1 className="font-bold text-xl">{user.username}</h1>
            <p>{user.bio}</p>
            <div className=" flex justify-between w-full  items-center ">
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
              {!isOwnProfile &&
                (isFollowing ? (
                  <button
                    className="px-4 py-2 bg-black text-white rounded cursor-pointer transition self-end"
                    onClick={handleFollow}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-black text-white rounded cursor-pointer transition self-end"
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                ))}
            </div>
          </div>
        </div>
        {loggedInUser?.id === user?.id && (
          <button
            className="hover:cursor-pointer absolute right-0"
            onClick={() => setToggle(!false)}
          >
            <Edit />
          </button>
        )}
      </div>

      {/* User's Posts */}
      <div className="mt-6">
        {user.posts?.length ? (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {user.posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square overflow-hidden rounded bg-gray-100 hover:opacity-90 cursor-pointer"
                onClick={() => setPostId(post.id)}
              >
                <img
                  src={post.image_url || "/fallback.jpg"}
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
      {toggle && <EditProfile onClose={() => setToggle(false)} />}
    </div>
  );
};

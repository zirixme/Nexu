import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../api/auth.js";
import { Edit } from "lucide-react";
import { EditProfile } from "../components/EditProfile.jsx";
export const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data</p>;

  return (
    <div className="w-full p-4 md:p-6 max-w-md md:max-w-xl xl:max-w-3xl">
      {/* Profile Info */}
      <div className="flex justify-between items-start border-b border-gray-400 pb-4">
        <div className="space-y-2">
          <img
            src={user.avatar_url}
            alt={`${user.username} profile pic`}
            className="w-20 h-20 rounded-full md:w-24 md:h-24"
          />
          <h1 className="font-bold text-xl">{user.username}</h1>
          <p>{user.bio}</p>
          <div className="flex gap-4">
            <p>
              {user.followers.length}{" "}
              <span className="text-gray-400">followers</span>
            </p>
            <p>
              {user.following.length}{" "}
              <span className="text-gray-400">following</span>
            </p>
          </div>
        </div>
        <button
          className="hover:cursor-pointer"
          onClick={() => setToggle(!false)}
        >
          <Edit />
        </button>
      </div>

      {/* User's Posts */}
      <div className="mt-6">
        {user.posts?.length ? (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {user.posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square overflow-hidden rounded bg-gray-100 hover:opacity-90 cursor-pointer"
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

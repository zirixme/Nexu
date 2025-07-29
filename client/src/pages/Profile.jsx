import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../api/auth.js";

export const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    getUser(id)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError("User not found or server error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
      <p>Bio: {user.bio}</p>
    </div>
  );
};

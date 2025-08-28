import { XIcon } from "lucide-react";
import { InputWithLabel } from "./InputWithLabel.jsx";
import { useState } from "react";
import { updateUser } from "../api/auth.js";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router";

export const EditProfile = ({ onClose }) => {
  const [newUsername, setNewUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const username = user.username;
  const navigate = useNavigate();
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (newUsername) formData.append("newUsername", newUsername);
      if (bio) formData.append("bio", bio);
      if (avatar) formData.append("image", avatar);

      const updatedUser = await updateUser(username, formData);
      setUser({
        ...user,
        username: updatedUser.data.username,
        avatar_url: updatedUser.data.avatar_url,
        bio: updatedUser.data.bio,
      });
      navigate(`/profile/${updatedUser.data.username}`);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      <form
        method="POST"
        className="bg-gray-50 max-w-md md:max-w-xl flex w-full flex-col  px-8 py-10 rounded border border-gray-400 gap-6 mx-2 xl:max-w-2xl relative"
        onSubmit={handleUpdateProfile}
      >
        <div>
          <label htmlFor="image">
            <img
              src={user.avatar_url}
              alt="upload image button"
              className="w-20 h-20 rounded-full"
            />
          </label>

          <input
            type="file"
            id="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>
        <InputWithLabel
          name={"newUsername"}
          label={"Username"}
          value={newUsername}
          placeholder={user.username}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <InputWithLabel
          name={"bio"}
          label={"Bio"}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button
          className="absolute right-2 top-2 cursor-pointer"
          onClick={onClose}
        >
          <XIcon />
        </button>
      </form>
    </div>
  );
};

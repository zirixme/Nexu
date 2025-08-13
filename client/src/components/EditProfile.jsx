import { XIcon } from "lucide-react";
import { InputWithLabel } from "./InputWithLabel.jsx";
import { useState } from "react";
import { updateUser } from "../api/auth.js";
export const EditProfile = ({ onClose }) => {
  const [newUsername, setNewUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (newUsername) formData.append("newUsername", newUsername);
      if (bio) formData.append("bio", bio);
      if (avatar) formData.append("image", avatar);

      const updatedUser = await updateUser(username, formData);
      if (updatedUser.data.username) {
        localStorage.setItem("username", updatedUser.data.username);
      }
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
        className="bg-gray-50 max-w-md md:max-w-xl flex w-full flex-col items-center p-4 rounded border border-gray-400 gap-4 mx-2 xl:max-w-2xl relative"
        onSubmit={handleUpdateProfile}
      >
        <InputWithLabel
          name={"newUsername"}
          label={"Username"}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <InputWithLabel
          name={"bio"}
          label={"Bio"}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button className="absolute right-4 cursor-pointer" onClick={onClose}>
          <XIcon />
        </button>
      </form>
    </div>
  );
};

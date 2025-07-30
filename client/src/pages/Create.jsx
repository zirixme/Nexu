import image from "../assets/lucide/image.svg";
import clapperboard from "../assets/lucide/clapperboard.svg";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { createPost } from "../api/auth.js";

export const Create = ({ onClose }) => {
  const [post, setPost] = useState("");
  const handlePost = async () => {
    try {
      await createPost({ text: post });
      setPost("");
      onClose();
    } catch (error) {
      console.error("Failed creating post:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      <form
        method="POST"
        className="bg-gray-50 max-w-md md:max-w-xl flex w-full flex-col items-center p-4 rounded border border-gray-400 gap-4 mx-2 xl:max-w-2xl relative"
      >
        <button className="absolute right-4 cursor-pointer" onClick={onClose}>
          <XIcon />
        </button>
        <textarea
          type="text"
          className="border-b border-gray-400 w-full resize-none p-2 focus:outline-none mt-4"
          placeholder="What’s happening?"
          rows={10}
          onChange={(e) => setPost(e.target.value)}
          value={post}
        />
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <button className="cursor-pointer">
              <img src={image} alt="import image" />
            </button>
            <button className="cursor-pointer">
              <img src={clapperboard} alt="import a video" />
            </button>
          </div>
          <button
            className="bg-black text-gray-50 px-6 py-2 rounded"
            onClick={handlePost}
            type="button"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

import image from "../assets/lucide/image.svg";
// import clapperboard from "../assets/lucide/clapperboard.svg";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { createPost } from "../api/auth.js";
import { getPosts } from "../api/auth.js";
export const Create = ({ onClose }) => {
  const [post, setPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", post);

      if (imageFile) {
        formData.append("image", imageFile);
      }
      await createPost(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getPosts();
      setImageFile(null);
      setPost("");
      onClose();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed creating post:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      {loading && (
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin top-5 absolute"></div>
      )}
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
            <label htmlFor="image" className="cursor-pointer">
              <img src={image} alt="import image" />
            </label>
            <input
              type="file"
              name=""
              id="image"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                }
              }}
            />

            {/* <button className="cursor-pointer">
              <img src={clapperboard} alt="import a video" />
            </button> */}
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

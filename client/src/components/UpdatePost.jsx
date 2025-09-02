import { useState, useEffect } from "react";
import { XIcon, ImageIcon } from "lucide-react";
export const UpdatePost = ({
  post,
  close,
  setImageFile,
  setPost,
  imageFile,
  loading,
  error,
  handleUpdatePost,
  comment,
  handleUpdateComment,
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      {error && (
        <div className="top-5 absolute bg-gray-50 rounded p-4">{error}</div>
      )}
      {loading && (
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin top-5 absolute"></div>
      )}
      <form
        onSubmit={comment ? handleUpdateComment : handleUpdatePost}
        className="bg-gray-50 max-w-md md:max-w-xl flex w-full flex-col items-center p-4 rounded border border-gray-400 gap-4 mx-2 xl:max-w-2xl relative dark:bg-gray-950 dark:text-white"
      >
        <button className="absolute right-4 cursor-pointer " onClick={close}>
          <XIcon />
        </button>
        <textarea
          type="text"
          className="border-b border-gray-400 w-full resize-none p-2 focus:outline-none mt-4"
          rows={10}
          onChange={(e) => setPost(e.target.value)}
          value={post}
        />
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <label htmlFor="image" className="cursor-pointer flex gap-2">
              <ImageIcon size={32} />
              {preview && (
                <img className="w-8 h-8 object-cover rounded" src={preview} />
              )}
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
          </div>

          <button
            className="bg-black dark:bg-white dark:text-black text-gray-50 px-6 py-2 rounded"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

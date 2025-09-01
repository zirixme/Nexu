import { deletePost } from "../api/auth.js";
export const PostOptions = ({ Close, postId, onPostDeleted }) => {
  const handleDeletePost = async () => {
    const id = postId;
    try {
      await deletePost(id);
      onPostDeleted(postId);
      Close();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/20 z-11 flex justify-center items-center">
      <div className="bg-gray-50 text-black dark:bg-black dark:text-white  rounded flex flex-col max-w-md w-full">
        <button
          className="cursor-pointer hover:bg-gray-200 p-4 transition-all duration-300 text-red-500 font-bold border-b border-gray-300"
          onClick={handleDeletePost}
        >
          Delete
        </button>
        <button className="cursor-pointer hover:bg-gray-200 p-4 transition-all duration-300 border-b border-gray-300">
          Edit
        </button>
        <button
          className="cursor-pointer hover:bg-gray-200 p-4 transition-all duration-300"
          onClick={Close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

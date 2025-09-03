import { deletePost } from "../api/auth.js";
import { deleteComment, updatePost, updateComment } from "../api/auth.js";
import { useState } from "react";
import { UpdatePost } from "./UpdatePost.jsx";

export const PostOptions = ({
  Close,
  postId,
  postText,
  onPostDeleted,
  comment,
  commentId,
  onCommentDeleted,
}) => {
  const [post, setPost] = useState(postText);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const close = () => {
    setEdit(false);
  };
  const handleDeleteComment = async () => {
    try {
      await deleteComment(postId, commentId);
      onCommentDeleted(commentId);
      Close();
    } catch (error) {
      console.error(error);
    }
  };
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

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", post);
    formData.append("image", imageFile);

    try {
      await updatePost(postId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      close();
      Close();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      await updateComment(commentId, post);
      close();
      Close();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/20 z-11 flex justify-center items-center">
      <div className="bg-gray-50 text-black dark:bg-black dark:text-white  rounded flex flex-col max-w-md m-2 w-full">
        {edit && (
          <UpdatePost
            comment={comment}
            post={post}
            setPost={setPost}
            close={close}
            setImageFile={setImageFile}
            imageFile={imageFile}
            loading={loading}
            error={error}
            handleUpdatePost={handleUpdatePost}
            handleUpdateComment={handleUpdateComment}
          />
        )}
        <button
          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-4 transition-all duration-300 text-red-500 font-bold border-b border-gray-300 dark:border-gray-700"
          onClick={comment ? handleDeleteComment : handleDeletePost}
        >
          Delete
        </button>
        <button
          className="dark:hover:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-200 p-4 transition-all duration-300 border-b border-gray-300"
          onClick={() => setEdit(true)}
        >
          Edit
        </button>
        <button
          className="dark:hover:bg-gray-800 cursor-pointer hover:bg-gray-200 p-4 transition-all duration-300"
          onClick={Close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

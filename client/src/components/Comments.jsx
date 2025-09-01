import { useState, useEffect } from "react";
import { XIcon, Ellipsis } from "lucide-react";
import { getComments, postComment } from "../api/auth.js";
import { PostOptions } from "./PostOptions.jsx";
import { useAuth } from "./AuthContext.jsx";
export const Comments = ({ onClose, id, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(false);
  const { user } = useAuth();
  const [selectedComment, setSelectedComment] = useState(null);
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setComments([]);

    const fetchComments = async () => {
      try {
        const res = await getComments(id);
        setComments(res.data);
      } catch (error) {
        console.error("Failed fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const onCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await postComment(id, newComment);
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center z-10 flex-col">
      {selectedComment && (
        <PostOptions
          comment={true}
          postId={id}
          commentId={selectedComment}
          Close={() => setSelectedComment(null)}
          onCommentDeleted={onCommentDeleted}
        />
      )}
      <div className="flex w-full flex-col items-center bg-gray-50 h-full md:h-4/5 md:max-w-xl xl:max-w-2xl rounded md:mt-10 dark:bg-gray-950 dark:text-white">
        <div className="p-6 w-full relative ">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 cursor-pointer"
          >
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full px-4 py-2">
          {loading ? (
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin top-5 absolute"></div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-400 dark:dark:border-gray-600 py-2 flex gap-4 relative"
              >
                {user?.id === comment.user_id && (
                  <button
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={() => setSelectedComment(comment.id)}
                  >
                    <Ellipsis />
                  </button>
                )}
                <img
                  src={comment.user.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="max-w-md xl:max-w-2xl">
                  <p className="wrap-anywhere">
                    <span className="font-bold mr-2">
                      {comment.user.username}
                    </span>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="">No comments yet</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full p-4 flex items-center gap-2 border-t border-gray-400 dark:border-gray-600"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-400 rounded px-4 py-2 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-black dark:bg-white dark:text-black  text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

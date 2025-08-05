import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { getComments, postComment } from "../api/auth.js";

export const Comments = ({ onClose, id }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await postComment(id, newComment);
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center z-10 flex-col">
      <div className="w-full flex flex-col items-center bg-gray-50 max-w-md rounded h-[90vh]">
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
            <p>Loading...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-400 py-2 flex gap-4"
              >
                <img
                  src={comment.user.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold">{comment.user.username}</h2>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full p-4 flex items-center gap-2 border-t"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

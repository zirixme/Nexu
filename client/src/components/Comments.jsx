import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { getComments } from "../api/auth.js";

export const Comments = ({ onClose, id }) => {
  const [comments, setComments] = useState([]);
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

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="bg-gray-50 p-4 rounded max-w-md w-full relative">
        <button
          onClick={onClose}
          className="mb-2 absolute right-4 cursor-pointer"
        >
          <XIcon />
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b py-2 flex gap-4">
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
    </div>
  );
};

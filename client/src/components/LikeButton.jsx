import { useState } from "react";
import { toggleLikeApi } from "../api/auth.js";
import { Heart } from "lucide-react";
export const LikeButton = ({
  postId,
  initialLiked,
  initialLikesCount,
  onToggleLike,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  const isDark = document.documentElement.classList.contains("dark");
  const strokeColor = liked ? "red" : isDark ? "white" : "black";
  const fillColor = liked ? "red" : "none";

  const toggleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await toggleLikeApi(postId);
      const data = res.data;
      setLiked(data.liked);
      setLikeCount(data.likesCount);
      onToggleLike?.(postId, data.liked, data.likesCount);
      if (onToggleLike) {
        onToggleLike(postId, data.liked, data.likesCount);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="flex gap-2 w-12 hover:cursor-pointer"
      onClick={toggleLike}
      disabled={loading}
    >
      <Heart fill={fillColor} stroke={strokeColor} />
      {likeCount}
    </button>
  );
};

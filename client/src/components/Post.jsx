import { MessageCircle } from "lucide-react";
import { LikeButton } from "./LikeButton.jsx";
import { Comments } from "./Comments.jsx";
import { getRelativeTime } from "../utils/utils.js";

export const Post = ({
  post,
  onToggleLike,
  activeCommentsPostId,
  setActiveCommentsPostId,
  underline,
}) => {
  const isCommentsOpen = activeCommentsPostId === post.id;

  return (
    <div
      className={`space-y-2 ${
        underline ? "border-b border-gray-400 mb-8" : "border-none mb-2"
      }`}
    >
      {/* Header: Avatar + Username + Time */}
      <div className="flex items-center  gap-2">
        <a
          href={`/profile/${post.user.username}`}
          className="flex items-center gap-2"
        >
          <img
            src={post.user.avatar_url || "/default-avatar.png"}
            alt={post.user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="font-semibold">{post.user.username}</p>
        </a>
        <p className="text-gray-400 text-sm">
          {"•  " + getRelativeTime(post.created_at)}
        </p>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="mb-4 w-full aspect-square">
          <img
            src={post.image_url}
            alt="Post image"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Like + Comment Buttons */}
      <div className="space-x-2 w-full flex">
        <LikeButton
          postId={post.id}
          initialLiked={post.likes?.length > 0}
          initialLikesCount={post._count?.likes || 0}
          onToggleLike={onToggleLike}
        />
        <button
          className="flex gap-2"
          onClick={() => setActiveCommentsPostId(post.id)}
        >
          <MessageCircle />
          {post._count.comments}
        </button>
      </div>

      {/* Comment Section */}
      {isCommentsOpen && (
        <Comments id={post.id} onClose={() => setActiveCommentsPostId(null)} />
      )}

      {/* Text Content */}
      {post.user.username && (
        <div className={`flex gap-4 ${underline ? "mb-4" : "none"}`}>
          <p className="font-bold">{post.user.username}</p>
          <p>{post.text}</p>
        </div>
      )}
    </div>
  );
};

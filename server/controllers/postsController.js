import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const userId = req.user.id;
    const { text } = req.body;

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "post-images" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    const newPost = await prisma.post.create({
      data: {
        user_id: userId,
        text,
        image_url: uploadResult.secure_url,
      },
    });
    res.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const posts = await prisma.post.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { id: true, username: true, avatar_url: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
        likes: userId
          ? {
              where: { user_id: userId },
              select: { id: true },
            }
          : false,
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("getPosts erorr:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }
    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: "post deleted" });
  } catch (error) {
    console.error("deletedPost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text, image_url } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    if (!text && !image_url) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(text !== undefined && { text }),
        ...(image_url !== undefined && { image_url }),
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("updatePost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleLike = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          post_id: postId,
          user_id: userId,
        },
      });
    }
    const likesCount = await prisma.like.count({
      where: { post_id: postId },
    });

    res.json({
      liked: !existingLike,
      likesCount,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const addComment = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const comment = await prisma.comment.create({
      data: { user_id: userId, post_id: postId, text },
      include: {
        user: {
          select: { username: true, avatar_url: true },
        },
      },
    });
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getComments = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { post_id: postId },
      orderBy: { created_at: "desc" },
      include: { user: true },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

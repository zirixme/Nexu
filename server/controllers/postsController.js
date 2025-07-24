import prisma from "../config/prisma.js";

export const createPost = async (req, res) => {
  try {
    const { text, image_url } = req.body;
    const userId = req.user.id;

    if (!text && !image_url) {
      return res
        .status(400)
        .json({ message: "Post must have text or an image" });
    }
    const newPost = await prisma.post.create({
      data: {
        user_id: userId,
        text,
        image_url,
      },
    });
    res.status(401).json(newPost);
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { id: true, username: true, avatar_url: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
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

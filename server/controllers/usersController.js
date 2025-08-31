import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
export const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
        avatar_url: true,
        bio: true,
        followers: {
          select: {
            follower: { select: { id: true } },
          },
        },
        following: {
          select: {
            following: { select: { id: true } },
          },
        },
        posts: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.params;
  if (!query) return res.status(400).json({ message: "Missing search query" });

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: { id: true, username: true, avatar_url: true, followers: true },
    });
    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server erorr" });
  }
};

export const updateUser = async (req, res) => {
  const { username } = req.params;
  const { newUsername, bio } = req.body;

  try {
    let avatarUrl;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "profile-pics" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        username: newUsername,
        bio,
        ...(avatarUrl && { avatar_url: avatarUrl }),
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req, res) => {
  const userId = req.user.id;
  const following = req.body.id;
  if (userId === following) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }
  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: following,
        },
      },
    });
    if (!existingFollow) {
      await prisma.follow.create({
        data: {
          follower_id: userId,
          following_id: following,
        },
      });
    }
    const updatedUser = await prisma.user.findUnique({
      where: { id: following },
      include: {
        posts: {
          orderBy: {
            created_at: "desc",
          },
        },
        followers: {
          select: { follower: { select: { id: true } } },
        },
        following: {
          select: { following: { select: { id: true } } },
        },
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  const userId = req.user.id;
  const following = req.body.id;

  try {
    await prisma.follow.delete({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: following,
        },
      },
    });
    const updatedUser = await prisma.user.findUnique({
      where: { id: following },
      include: {
        posts: {
          orderBy: {
            created_at: "desc",
          },
        },
        followers: {
          select: { follower: { select: { id: true } } },
        },
        following: {
          select: { following: { select: { id: true } } },
        },
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

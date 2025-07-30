import prisma from "../config/prisma.js";

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        avatar_url: true,
        bio: true,
        followers: true,
        following: true,
        posts: true,
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

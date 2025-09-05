import prisma from "../config/prisma.js";

export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, username: true, avatar_url: true } },
        receiver: { select: { id: true, username: true, avatar_url: true } },
      },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { receiverId, text } = req.body;

  if (!receiverId || !text) {
    return res.status(400).json({ message: "Receiver and text is required" });
  }
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) return res.status(404).json({ message: "Receiver not found" });
  try {
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        text,
      },
      include: {
        sender: { select: { id: true, username: true, avatar_url: true } },
        receiver: { select: { id: true, username: true, avatar_url: true } },
      },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true, avatar_url: true } },
        receiver: { select: { id: true, username: true, avatar_url: true } },
      },
    });

    const conversationsMap = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          ...otherUser,
          lastMessage: msg.text,
          createdAt: msg.createdAt,
        });
      }
    });
    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChatUsers = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. All users you've chatted with
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, username: true, avatar_url: true } },
        receiver: { select: { id: true, username: true, avatar_url: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Users you follow
    const following = await prisma.follow.findMany({
      where: { follower_id: userId },
      include: {
        following: { select: { id: true, username: true, avatar_url: true } },
      },
    });

    // 3. Users who follow you
    const followers = await prisma.follow.findMany({
      where: { following_id: userId },
      include: {
        follower: { select: { id: true, username: true, avatar_url: true } },
      },
    });

    // 4. Merge into a single map to deduplicate
    const usersMap = {};

    messages.forEach((msg) => {
      const other = msg.senderId === userId ? msg.receiver : msg.sender;
      usersMap[other.id] = other;
    });

    following.forEach((f) => {
      usersMap[f.following.id] = f.following;
    });

    followers.forEach((f) => {
      usersMap[f.follower.id] = f.follower;
    });

    const chatUsers = Object.values(usersMap);
    res.json(chatUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

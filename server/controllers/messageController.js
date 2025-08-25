import prisma from "../config/prisma.js";

export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params.id;
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
  const otherUserId = req.params.id;
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
    // Get all messages involving the user
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, username: true, avatar_url: true } },
        receiver: { select: { id: true, username: true, avatar_url: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Deduplicate to get unique users
    const usersMap = {};
    messages.forEach((msg) => {
      const other = msg.sender.id === userId ? msg.receiver : msg.sender;
      usersMap[other.id] = other; // last message wins
    });

    const chatUsers = Object.values(usersMap);
    res.json(chatUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

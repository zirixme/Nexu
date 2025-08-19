import prisma from "../config/prisma.js";

export const getMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
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
  const {receiverId, text} = req.body;

  if (!receiverId || text) {
    return res.status(400).json({message: "Receiver and text is required"})
  }
  try {
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        text
      }
      include: {
        sender: { select: { id: true, username: true, avatar_url: true } },
        receiver: { select: { id: true, username: true, avatar_url: true } }
      }
    })
    res.status(201).json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Server error"})
  }
}

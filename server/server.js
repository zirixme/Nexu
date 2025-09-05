// imports //
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "node:http";
import prisma from "./config/prisma.js";
// routes imports //
import authRoutes from "./routes/authRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

const onlineUsers = new Map();

// middleware //
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_message", async ({ senderId, receiverId, text }) => {
    try {
      const message = await prisma.message.create({
        data: { senderId, receiverId, text },
        include: {
          sender: { select: { id: true, username: true, avatar_url: true } },
          receiver: { select: { id: true, username: true, avatar_url: true } },
        },
      });

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", message);
      }

      socket.emit("receive_message", message);
    } catch (err) {
      console.error(err);
    }
    socket.on("disconnect", () => {
      onlineUsers.forEach((val, key) => {
        if (val === socket.id) onlineUsers.delete(key);
      });
      console.log("User disconnected:", socket.id);
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    onlineUsers.forEach((val, key) => {
      if (val === socket.id) onlineUsers.delete(key);
    });
    console.log("User disconnected:", socket.id);
  });
});

// routes //
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/u", usersRoutes);
app.use("/api/messages", messageRoutes);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});

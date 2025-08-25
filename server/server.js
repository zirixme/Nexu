// imports //
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes imports //
import authRoutes from "./routes/authRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js";

const app = express();

// middleware //
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// routes //
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/u", usersRoutes);
app.use("/api/messages", messageRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});

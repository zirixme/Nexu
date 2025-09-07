import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const isDev = process.env.NODE_ENV !== "production";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashPassword,
      },
    });

    //const token = generateToken(newUser.id);
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);
    // res.status(201).json({
    //   id: newUser.id,
    //   token,
    // });
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: isDev ? "lax" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({
        accessToken,
        id: newUser.id,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
      });
  } catch (error) {
    console.error("signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = generateToken(user.id);
    // res.json({
    //   id: user.id,
    //   username: user.username,
    //   token,
    //   avatar_url: user.avatar_url,
    // });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: isDev ? "lax" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      accessToken,
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(payload.id);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true, avatar_url: true },
    });

    res.json({
      accessToken: newAccessToken,
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
    });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const signout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(400).json({ message: "No refresh token found" });

  try {
    await prisma.refreshToken.delete({
      where: { token },
    });
  } catch (error) {
    console.error("Error deleting refresh token:", error);
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: isDev ? "lax" : "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

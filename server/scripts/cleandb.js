import prisma from "../config/prisma.js";
await prisma.refreshToken.deleteMany();
await prisma.message.deleteMany();
await prisma.like.deleteMany();
await prisma.comment.deleteMany();
await prisma.post.deleteMany();
await prisma.follow.deleteMany();
await prisma.user.deleteMany();

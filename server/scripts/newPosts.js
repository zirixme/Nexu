import prisma from "../config/prisma.js";

const user2 = await prisma.user.findUnique({
  where: { username: "bob" },
});
const post2 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post3 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post4 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post5 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post6 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post7 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post8 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

const post9 = await prisma.post.create({
  data: {
    user_id: user2.id,
    text: "Bob’s second post!",
    image_url: "https://picsum.photos/seed/post2/400/300",
  },
});

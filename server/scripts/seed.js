import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // Create users
  const password = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@example.com",
      password_hash: password,
      bio: "Hi, I am Alice!",
      avatar_url: "https://i.pravatar.cc/150?img=1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@example.com",
      password_hash: password,
      bio: "Bob here.",
      avatar_url: "https://i.pravatar.cc/150?img=2",
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      user_id: user1.id,
      text: "Hello, this is my first post!",
      image_url: "https://picsum.photos/seed/post1/400/300",
    },
  });

  const post2 = await prisma.post.create({
    data: {
      user_id: user2.id,
      text: "Bob’s first post!",
      image_url: "https://picsum.photos/seed/post2/400/300",
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      user_id: user2.id,
      post_id: post1.id,
      text: "Nice post Alice!",
    },
  });

  await prisma.comment.create({
    data: {
      user_id: user1.id,
      post_id: post2.id,
      text: "Thanks Bob!",
    },
  });

  // Likes
  await prisma.like.create({
    data: {
      user_id: user2.id,
      post_id: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      user_id: user1.id,
      post_id: post2.id,
    },
  });

  // Follow
  await prisma.follow.create({
    data: {
      follower_id: user2.id,
      following_id: user1.id,
    },
  });

  await prisma.follow.create({
    data: {
      follower_id: user1.id,
      following_id: user2.id,
    },
  });

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

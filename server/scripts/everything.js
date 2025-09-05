import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // --- USERS ---
  const usersData = [
    { username: "alice", email: "alice@test.com", password: "123456" },
    { username: "bob", email: "bob@test.com", password: "123456" },
    { username: "charlie", email: "charlie@test.com", password: "123456" },
  ];

  const users = [];
  for (const u of usersData) {
    const password_hash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        password_hash,
        bio: u.bio || null,
        avatar_url: u.avatar_url || "/user.svg",
      },
    });
    users.push(user);
  }

  // --- FOLLOWS ---
  await prisma.follow.create({
    data: {
      follower: { connect: { id: users[0].id } },
      following: { connect: { id: users[1].id } },
    },
  });

  // --- POSTS ---
  const posts = [];
  for (const user of users) {
    const post = await prisma.post.create({
      data: {
        user_id: user.id,
        text: `Hello, I'm ${user.username}!`,
      },
    });
    posts.push(post);
  }

  // --- COMMENTS ---
  for (const post of posts) {
    await prisma.comment.create({
      data: {
        post_id: post.id,
        user_id: users[0].id === post.user_id ? users[1].id : users[0].id,
        text: `Nice post, ${post.user_id}!`,
      },
    });
  }

  // --- LIKES ---
  for (const post of posts) {
    await prisma.like.create({
      data: {
        post_id: post.id,
        user_id: users[0].id === post.user_id ? users[1].id : users[0].id,
      },
    });
  }

  // --- MESSAGES ---
  await prisma.message.createMany({
    data: [
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        text: "Hey Bob, how are you?",
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        text: "I’m good, Alice! You?",
      },
      {
        senderId: users[0].id,
        receiverId: users[2].id,
        text: "Hi Charlie, welcome!",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

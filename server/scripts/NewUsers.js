import prisma from "../config/prisma.js";

const samplePosts = [
  "Just had an amazing day!",
  "Loving this new game I found.",
  "Does anyone know a good recipe for pasta?",
  "Check out this cool photo I took.",
  "Can't believe how fast this week went by.",
];

const sampleMessages = [
  "Hey, how are you?",
  "Are you free tomorrow?",
  "Did you see the latest episode?",
  "Let's catch up soon!",
  "Can you send me the file?",
];

async function main() {
  // Create 5 users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password_hash: "123",
        bio: `This is user${i}'s bio`,
        avatar_url: `https://i.pravatar.cc/150?img=${i}`,
      },
    });
    users.push(user);
  }

  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const text = samplePosts[Math.floor(Math.random() * samplePosts.length)];
    await prisma.post.create({
      data: {
        user_id: randomUser.id,
        text,
        image_url:
          Math.random() > 0.5
            ? `https://picsum.photos/200/300?random=${i}`
            : null,
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    let receiver;
    do {
      receiver = users[Math.floor(Math.random() * users.length)];
    } while (receiver.id === sender.id);

    const text =
      sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        text,
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

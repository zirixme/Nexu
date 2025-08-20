import prisma from "../config/prisma.js";

// scripts/seedBobAliceMessages.js
import { PrismaClient } from "@prisma/client";

const sampleTexts = [
  "Hey Alice, how are you?",
  "Hi Bob! I'm good, thanks!",
  "Did you finish the project?",
  "Almost done, just a few tweaks.",
  "Let's meet later today.",
  "Sure, see you at 6!",
];

async function main() {
  try {
    const bob = await prisma.user.findUnique({ where: { username: "bob" } });
    const alice = await prisma.user.findUnique({
      where: { username: "alice" },
    });

    if (!bob || !alice) {
      console.log("Bob or Alice not found in the database.");
      return;
    }

    for (let i = 0; i < sampleTexts.length; i++) {
      const sender = i % 2 === 0 ? bob : alice;
      const receiver = i % 2 === 0 ? alice : bob;

      await prisma.message.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          text: sampleTexts[i],
        },
      });
    }

    console.log("Messages between Bob and Alice created!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

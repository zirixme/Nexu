import prisma from "../config/prisma.js";

await prisma.user.updateMany({
  where: { avatar_url: null },
  data: { avatar_url: "/user.svg" },
});

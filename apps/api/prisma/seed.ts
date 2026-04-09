import { prisma } from "../src/lib/prisma.ts";

async function main() {
  console.log("Starting seed...");

  const userNames = [
    "John Doe",
    "Sarah Lee",
    "Ahmed Ali",
    "Emily Davis",
    "Omar Hassan",
    "Lina Karim",
    "James Carter",
    "Nour Eldeen",
    "Sophia Turner",
  ];

  for (const name of userNames) {
    let user = await prisma.user.findFirst({ where: { name } });

    if (!user) {
      user = await prisma.user.create({
        data: { name },
      });
      console.log(
        `✅ User created successfully: ${user.name} (ID: ${user.id})`,
      );
    } else {
      console.log(`ℹ️  User already exists: ${user.name} (ID: ${user.id})`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

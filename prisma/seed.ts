import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from '../src/prisma'

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash("Admin123", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@evently.com" },
    create: {
      name: "Admin",
      email: "admin@evently.com",
      password: hashedPassword,
      role: "admin",
    },
    update: {},
  });

  console.log("Admin seeded successfully!");
}

async function main() {
  console.log('Starting seeding...');
  await seedAdmin();
  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
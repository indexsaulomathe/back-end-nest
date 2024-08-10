import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function seedUsers() {
  const userData = [
    {
      name: 'Sabin Adams',
      email: 'sabin@adams.com',
      password: 'password-sabin',
      blocked: false,
      createdBy: 'system',
    },
    {
      name: 'Alex Ruheni',
      email: 'alex@ruheni.com',
      password: 'password-alex',
      blocked: false,
      createdBy: 'system',
    },
  ];

  const hashedUserData = await Promise.all(
    userData.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, roundsOfHashing),
    })),
  );

  return Promise.all(
    hashedUserData.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: { password: user.password },
        create: user,
      }),
    ),
  );
}

async function seedDatabase() {
  await seedUsers();
}

async function main() {
  try {
    await seedDatabase();
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

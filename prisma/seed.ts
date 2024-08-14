import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function seedUsers() {
  const userData = [
    {
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin12345',
      roles: ['admin', 'user'],
      blocked: false,
      createdBy: 'system',
    },
    {
      name: 'User',
      email: 'user@user.com',
      password: 'user12345',
      roles: ['user'],
      blocked: false,
      createdBy: 'system',
    },
  ];

  // Hash passwords and prepare user data
  const hashedUserData = await Promise.all(
    userData.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, roundsOfHashing),
    })),
  );

  // Upsert users and create wallets in the database
  return Promise.all(
    hashedUserData.map(async (user) => {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          password: user.password,
          roles: user.roles,
          blocked: user.blocked,
          updatedBy: 'system',
        },
        create: user,
      });

      // Create a wallet for each user
      await prisma.wallet.upsert({
        where: { userId: createdUser.id },
        update: {}, // No fields to update for existing wallets
        create: {
          balance: "0",
          userId: createdUser.id,
          createdBy: 'system',
        },
      });
    }),
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

import prismaClient from '../src/prisma';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = prismaClient as PrismaClient;

async function main() {
  const password = 'Haslo12345.';
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      role: 'ADMIN' as const,
    },
    {
      name: 'Kacper',
      email: 'kacper@gmail.com',
      role: 'USER' as const,
    },
    {
      name: 'Anna',
      email: 'anna@gmail.com',
      role: 'USER' as const,
    },
    {
      name: 'Jakub',
      email: 'jakub@gmail.com',
      role: 'USER' as const,
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
      console.log(`${user.role} ${user.email} created`);
    } else {
      console.log(`${user.role} ${user.email} already exists`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

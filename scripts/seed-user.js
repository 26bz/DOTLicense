import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('supersecurepassword', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Example Admin',
      userName: '26bz',
      email: 'contact@example.com',
      password: hashedPassword,
      dateOfBirth: new Date('2001-01-01'),
      role: 'ADMIN',
    },
  });
  console.log('Created First Admin User:', admin.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error Seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

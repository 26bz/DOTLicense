import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('supersecurepassword', 10)

  const admin = await prisma.user.create({
    data: {
      firstName: 'Example',
      lastName: 'BZ',
      userName: 'Example',
      email: 'contact@example.com',
      password: hashedPassword,
      phone: '111-111-1111',
      dateOfBirth: new Date('2001-01-01'),
      role: 'ADMIN',
      street: '123 Google Drive, New York',
      country: 'United States',
    },
  })
  console.log('Created First Admin User:', admin.email)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error('Error Seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

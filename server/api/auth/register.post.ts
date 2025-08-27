import { z } from 'zod';
import prisma from '~~/lib/prisma';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, dateOfBirth, password } = schema.parse(body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Email already registered' });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      dateOfBirth: new Date(dateOfBirth),
      password: hashedPassword,
    },
  });

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      dateOfBirth: new Date(),
      email: user.email,
      role: user.role,
    },
    loggedInAt: new Date(),
  });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
});

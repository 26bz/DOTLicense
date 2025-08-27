import { z } from 'zod';
import prisma from '~~/lib/prisma';
import bcrypt from 'bcrypt';

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });

  const body = await readBody(event);
  const { currentPassword, newPassword } = schema.parse(body);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user)
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found',
    });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid)
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid current password',
    });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  return { success: true };
});

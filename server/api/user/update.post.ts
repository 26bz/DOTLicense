import { z } from 'zod';
import prisma from '~~/lib/prisma';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });

  const body = await readBody(event);
  const data = schema.parse(body);

  await authorize(event, updateUser, session.user, session.user);

  const updatedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return { user: updatedUser };
});

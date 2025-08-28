import { z } from 'zod';
import prisma from '~~/lib/prisma';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const body = await readBody(event);
  const data = schema.parse(body);

  await authorize(event, updateUser, session.user, session.user);

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      email: data.email,
      dateOfBirth: new Date(data.dateOfBirth),
    },
  });

  await setUserSession(event, {
    ...session,
    user: {
      ...session.user,
      name: updatedUser.name,
      email: updatedUser.email,
      dateOfBirth: updatedUser.dateOfBirth,
    },
  });
  return { user: updatedUser };
});

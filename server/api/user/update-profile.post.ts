import { z } from 'zod';
import prisma from '~~/lib/prisma';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  newsletterSubscribed: z.boolean().optional(),
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
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      newsletterSubscribed: data.newsletterSubscribed,
    },
  });

  await setUserSession(event, {
    ...session,
    user: {
      ...session.user,
      name: updatedUser.name,
      email: updatedUser.email,
      dateOfBirth: updatedUser.dateOfBirth,
      street: updatedUser.street,
      city: updatedUser.city,
      state: updatedUser.state,
      zipCode: updatedUser.zipCode,
      country: updatedUser.country,
      newsletterSubscribed: updatedUser.newsletterSubscribed,
    },
  });
  return { user: updatedUser };
});

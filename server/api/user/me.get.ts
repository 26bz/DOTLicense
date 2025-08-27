import { updateUser } from '~~/shared/utils/abilities';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });

  await authorize(event, updateUser, session.user, session.user);

  return { user: session.user };
});

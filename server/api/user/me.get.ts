import { updateUser } from '~~/shared/utils/abilities';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  await authorize(event, updateUser, session.user, session.user);

  return { user: session.user };
});

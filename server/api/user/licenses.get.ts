import prisma from '~~/lib/prisma';
import { viewLicense } from '~~/shared/utils/abilities';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  authorize(event, viewLicense, session.user.id);

  const licenses = await prisma.license.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { issuedAt: 'desc' },
  });

  return { licenses };
});

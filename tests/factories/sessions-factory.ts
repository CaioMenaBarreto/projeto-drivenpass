import { createUser } from './users-factory';
import { prisma } from '../../src/config/index';

export async function createSession(token: string) {
  const user = await createUser();

  return prisma.session.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}

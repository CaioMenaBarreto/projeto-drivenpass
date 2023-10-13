import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/config/index';

export async function createUserByInfo(email: string, password: string) {
  const incomingPassword = password;
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
}

export async function createUser() {
  const incomingPassword = faker.internet.password(10);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  const credential = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: hashedPassword,
    },
  });

  return {
    id: credential.id,
    email: credential.email,
    password: incomingPassword
  }
}

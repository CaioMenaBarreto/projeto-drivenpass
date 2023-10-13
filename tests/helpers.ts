import { User } from '@prisma/client';
import { prisma } from '../src/config/index';
import { createSession } from './factories/sessions-factory';
import { createUser } from './factories/users-factory';
import * as jwt from 'jsonwebtoken';


export async function cleanDb() {
    await prisma.credential.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
}

export async function generateValidToken(user?: User) {
    const incomingUser = user || (await createUser());
    const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

    await createSession(token);

    return token;
}
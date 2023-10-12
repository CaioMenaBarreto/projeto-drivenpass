import { prisma } from "../config/index";

async function verifyUser(email: string) {
    return await prisma.user.findFirst({
        where: { email: email }
    })
}


async function verifyUserById(userId: number) {
    return await prisma.user.findFirst({
        where: { id: userId }
    })
}

async function createUser(email: string, password: string) {
    return await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })
}

async function createSession(token: string, userId: number) {
    return prisma.session.create({
        data: {
            token,
            userId
        }
    });
}

async function findSession(token: string) {
    return prisma.session.findFirst({
        where: {
            token,
        },
    });
}


export const userRepository = {
    verifyUser,
    createUser,
    createSession,
    findSession,
    verifyUserById
}
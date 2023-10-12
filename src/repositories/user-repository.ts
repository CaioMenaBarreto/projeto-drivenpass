import { prisma } from "../config/index";

async function verifyUser(email: string) {
    return await prisma.user.findFirst({
        where: { email: email }
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

export const userRepository = {
    verifyUser,
    createUser
}
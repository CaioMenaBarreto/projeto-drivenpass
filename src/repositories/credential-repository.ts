import { prisma } from "@/config"

export async function createCredentials(userId: number, title: string, url: string, username: string, password: string) {
    return await prisma.credential.create({
        data: {
            userId,
            title,
            url,
            username,
            password
        }
    })
}

async function findCredentialByTitle(title: string, userId: number) {
    return await prisma.credential.findFirst({
        where: {
            title: title,
            userId: userId
        }
    })
}

export const credentialRepository = {
    createCredentials,
    findCredentialByTitle
}
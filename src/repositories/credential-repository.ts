import { prisma } from "../config/index"

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

async function getAllCredentials(userId: number){
    return await prisma.credential.findMany({
        where:{
            userId: userId
        }
    })
}

async function getCredentialById(userId: number, credentialId: number){
    return await prisma.credential.findFirst({
        where: {
            id: credentialId,
            userId: userId
        }
    })
}

async function deleteCredential(userId: number, credentialId: number){
    return await prisma.credential.delete({
        where: {
            id: credentialId,
            userId: userId
        }
    })
}

export const credentialRepository = {
    createCredentials,
    findCredentialByTitle,
    getAllCredentials,
    getCredentialById,
    deleteCredential
}
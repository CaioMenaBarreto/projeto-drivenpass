import { NotFound, credentialExists, credentialNotExists, unauthorizedError } from "@/errors";
import { Credential, NewCredential } from "@/protocols";
import { credentialRepository, userRepository } from "@/repositories"
import Cryptr from "cryptr";
import { cryptrSecret } from '../../cryptr';

const cryptr = new Cryptr(cryptrSecret);

async function createCredentials(userId: number, title: string, url: string, username: string, password: string) {
    const user = await userRepository.verifyUserById(userId);
    if (!user) throw unauthorizedError();

    const credentialExist = await credentialRepository.findCredentialByTitle(title, userId);
    if (credentialExist) throw credentialExists();

    const hash = cryptr.encrypt(password);
    const credential: NewCredential = await credentialRepository.createCredentials(userId, title, url, username, hash);
    return credential;
}

async function getAllCredentials(userId: number) {
    const credentials = await credentialRepository.getAllCredentials(userId);
    let result = []
    for (let i = 0; i < credentials.length; i++) {
        let encryptedPassword = credentials[i].password
        let decryptPassword = cryptr.decrypt(encryptedPassword)
        result.push(
            {
                id: credentials[i].id,
                title: credentials[i].title,
                url: credentials[i].url,
                userId: credentials[i].userId,
                username: credentials[i].username,
                password: decryptPassword
            })
    }
    return result;
}

async function getCredentialById(userId: number, credentialId: number) {
    const credential = await credentialRepository.getCredentialById(userId, credentialId);
    if (!credential) throw credentialNotExists();
    const decryptPassword = cryptr.decrypt(credential.password);
    const result: Credential = {
        id: credential.id,
        userId: credential.userId,
        title: credential.title,
        url: credential.url,
        username: credential.username,
        password: decryptPassword,
    }
    return result;
}

async function deleteCredential(userId: number, credentialId: number){
    const credential = await credentialRepository.getCredentialById(userId, credentialId);
    if (!credential) throw credentialNotExists();
    await credentialRepository.deleteCredential(userId, credentialId);
    return 'ok';
}

export const credentialService = {
    createCredentials,
    getAllCredentials,
    getCredentialById,
    deleteCredential
}
import { credentialExists, unauthorizedError } from "@/errors";
import { NewCredential } from "@/protocols";
import { credentialRepository, userRepository } from "@/repositories"
import Cryptr from "cryptr";
import { cryptrSecret } from '../../cryptr';

const cryptr = new Cryptr(cryptrSecret);

async function createCredentials(userId: number, title: string, url: string, username: string, password: string) {
    const user = await userRepository.verifyUserById(userId);
    if (!user) throw unauthorizedError();

    const credentialExist = await credentialRepository.findCredentialByTitle(title, userId);
    if(credentialExist) throw credentialExists();

    const hash = cryptr.encrypt(password);
    const credential: NewCredential = await credentialRepository.createCredentials(userId, title, url, username, hash);
    return credential;
}

export const credentialService = {
    createCredentials
}
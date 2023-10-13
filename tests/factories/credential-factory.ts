import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/config/index';

export async function createCredentialByInfo(userId: number, title: string, url: string, username: string, password: string) {
    const incomingPassword = password;
    const hashedPassword = await bcrypt.hash(incomingPassword, 10);

    return prisma.credential.create({
        data: {
            userId,
            title,
            url,
            username,
            password
        },
    });
}

// export async function createCredential() {
//     const incomingPassword = password;
//     const hashedPassword = await bcrypt.hash(incomingPassword, 10);

//     return prisma.credential.create({
//         data: {
//             userId,
//             title,
//             url,
//             username,
//             password
//         },
//     });
// }
import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import app, { init } from '../src/app';
import { prisma } from '../src/config/index';
import { createUser, createUserByInfo } from './factories/users-factory';
import { cleanDb, generateValidToken } from './helpers';
import { createSession } from './factories/sessions-factory';
import { validatePasswordOrFail } from '../src/services/index';


const server = supertest(app);


beforeAll(async () => {
    await init();
    await cleanDb();
});

const generateValidBody = () => ({
    title: faker.word.words(),
    url: faker.internet.url(),
    username: faker.lorem.word(),
    password: faker.internet.password(5)
});

describe('/POST', () => {
    it('should return status 201 when successful', async () => {
        const user = await createUser();
        const response = await server.post('/users/sign-in').send(user);
        const token = response.header.token;

        const session = await prisma.session.findFirst({
            where: {
                token: token
            }
        })

        const infoForCredential = generateValidBody() 

        const credential = {
            userId: session.userId,
            title: infoForCredential.title,
            url: infoForCredential.url,
            username: infoForCredential.username,
            password: infoForCredential.password
        }

        const result = await server.post('/credentials/create').send(credential);
        expect(result.status).toBe(httpStatus.CREATED);
        expect(result.body).toEqual({
            userId: session.userId,
            title: infoForCredential.title,
            url: infoForCredential.url,
            username: infoForCredential.username,
            password: infoForCredential.password
        });
    })
})
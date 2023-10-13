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
        const response = await server.post('/users/sign-in').send({ email: user.email, password: user.password });
        const token = response.body.token;

        const session = await prisma.session.findFirst({
            where: {
                token: token
            }
        })

        const infoForCredential = generateValidBody()

        const credential = {
            userId: user.id,
            title: infoForCredential.title,
            url: infoForCredential.url,
            username: infoForCredential.username,
            password: infoForCredential.password
        }

        const result = await server.post('/credentials/create').set('Authorization', `Bearer ${token}`).send(credential);
        expect(result.status).toBe(httpStatus.CREATED);
        expect(result.body).toEqual({
            userId: session.userId,
            title: infoForCredential.title,
            url: infoForCredential.url,
            username: infoForCredential.username,
            password: infoForCredential.password
        });
    })

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/credentials/find-many').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return 404 when credential not exist', async () => {
        const user = await createUser();
        const responseUser = await server.post('/users/sign-in').send({ email: user.email, password: user.password });
        const token = responseUser.body.token;

        const response = await server.get(`/credentials/find/${0}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })

    it('should return 202 whed delete credential is successful', async () => {
        const user = await createUser();
        const responseUser = await server.post('/users/sign-in').send({ email: user.email, password: user.password });
        console.log(user.password)
        const token = responseUser.body.token;

        const session = await prisma.session.findFirst({
            where: {
                token: token
            }
        })

        const infoForCredential = generateValidBody()
        console.log(user);
        const credential = {
            userId: user.id,
            title: infoForCredential.title,
            url: infoForCredential.url,
            username: infoForCredential.username,
            password: infoForCredential.password
        }

        const resultCredential = await server.post('/credentials/create').set('Authorization', `Bearer ${token}`).send(credential);
        const credentialId = resultCredential.body;

        const response = await server.delete(`/credentials/delete/${credentialId.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(202)
    })
})
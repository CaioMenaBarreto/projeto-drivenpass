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



beforeEach(async () => {
  await init();
  await cleanDb();
});

describe('/POST signUp', () => {
  it('should respond with status 422 when body is not given', async () => {
    const response = await server.post('/users/sign-up');

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 when email is not given', async () => {
    const generateValidBody = () => ({
      password: "0123456789",
    });
    const body = generateValidBody();

    const response = await server.post('/users/sign-up').send(body);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 when password is not given', async () => {
    const generateValidBody = () => ({
      email: "bernardo@gmail.com"
    });
    const body = generateValidBody();

    const response = await server.post('/users/sign-up').send(body);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 409 when user already exists', async () => {
    const generateValidBody = () => ({
      email: "bernardo@gmail.com",
      password: "0123456789",
    });
    const body = generateValidBody();
    await createUserByInfo(body.email, body.password);

    const response = await server.post('/users/sign-up').send(body);
    expect(response.status).toBe(httpStatus.CONFLICT);
  })

  it('should respond with status 201 when body is given in the correct format', async () => {

    const generateValidBody = () => ({
      email: "bernardo@gmail.com",
      password: "0123456789",
    });
    const body = generateValidBody();

    const response = await server.post('/users/sign-up').send(body);
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    expect(user).toEqual({
      id: user.id,
      email: user.email,
      password: user.password
    })
  })
});

describe('/POST sign-in', () => {
  it('should respond with status 422 when body is not given', async () => {
    const response = await server.post('/users/sign-in');

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/users/sign-in').send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it('should respond with status 401 if there is no user for given email', async () => {
      const body = generateValidBody();

      const response = await server.post('/users/sign-in').send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
      const body = generateValidBody();
      await createUserByInfo(body.email, body.password);

      const response = await server.post('/users/sign-in').send({
        email: body.email,
        password: faker.internet.password(10),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when credentials are valid', () => {
      it('should respond with status 200', async () => {
        const body = generateValidBody();
        const user = await createUserByInfo(body.email, body.password);
        const login = {
          email: user.email,
          password: body.password
        }
        const response = await server.post('/users/sign-in').send(login);

        expect(response.status).toBe(httpStatus.OK);
      });

      it('should respond with session token', async () => {
        const body = await createUser();
        const user = await prisma.user.findFirst({
          where: {
            id: body.id
          }
        })
        const response = await server.post('/users/sign-in').send(body);
        const token = response.header.token;

        expect(response.header.token).toBe(token);
      });
    });
  });
});
const { DB } = require('../../src/database');
const supertest = require('supertest');
const app = require('../../src/app');
const faker = require('faker');
const server = supertest(app);
const { getToken } = require('../utils');
const { seed } = require('../../src/scripts/seeds');
const { ACCOUNT_TYPES } = require('../../src/constants');

const userClient = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

let db;
beforeAll(async () => {
  db = new DB();
  await db.connect();
});

afterAll(async () => {
  await db.disconnect();
});

describe('Registration', () => {
  it('register client', async () => {
    const res = await server.post('/v1/auth/register').send({
      ...userClient,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phoneNumber: faker.phone.phoneNumber(),
      type: 'customer',
    });
    console.log(res.body, res.error);

    expect(res.status).toEqual(200);
    userClient.accountId = res.body.data._id;
  });
});

describe('Email verification', () => {
  it('email verify client', async () => {
    const { token, accountId } = await getToken(userClient);
    const res = await server.post('/v1/auth/verify-email').send({
      token,
      accountId,
    });
    console.log(res.body, res.error);
    expect(res.status).toEqual(200);
  });
});

describe('Login', () => {
  it('login client', async () => {
    const res = await server.post('/v1/auth/login').send({
      ...userClient,
      type: ACCOUNT_TYPES.CUSTOMER,
    });

    console.log(res.body, res.error);
    expect(res.status).toEqual(200);
    // userClient.accountId = res.body.data._id;
  });
});

describe('Forgot Password', () => {
  it('forgot password client', async () => {
    const res = await server.post('/v1/auth/forgot-password').send({
      ...userClient,
      type: ACCOUNT_TYPES.CUSTOMER,
    });

    console.log(res.body, res.error);
    expect(res.status).toEqual(200);
    userClient.resetToken = res.body.token;
  });
});

describe('Reset Password', () => {
  it('reset password client', async () => {
    const password = '12345rrr';
    const res = await server.post('/v1/auth/reset-password').send({
      token: userClient.resetToken,
      confirmPassword: password,
      password,
    });

    expect(res.status).toEqual(200);
    console.log(res.body);
    // userClient.accountId = res.body.data._id;
  });
});

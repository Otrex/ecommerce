const supertest = require('supertest');
const app = require('../../src/app');
const faker = require('faker');
const { getToken } = require('../utils');
const { ACCOUNT_TYPES, TOKEN_FLAG } = require('../../src/constants');
const { documentation } = require('../setup');
const { assert } = require('chai');
const { createAccountReturnToken } = require('../utils');

const server = supertest(app);
const userClient = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const userBusiness = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const adminData = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.ADMIN,
  isSuperAdmin: true,
};

describe('Authentication', () => {
  let verificationToken;
  describe('Registration', () => {
    it('register client', async () => {
      const res = await server.post('/v1/buyer/register').send({
        email: userClient.email,
        password: userClient.password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: 'male',
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
      userClient.$verifyToken = res.body.data.token;
    });

    it('register business', async () => {
      const res = await server.post('/v1/vendor/register').send({
        sellerDetails: {
          ...userBusiness,
          phoneNumber: '+2345678765456',
          fullName: [
            faker.name.firstName(),
            faker.name.lastName(),
          ].join(' '),
        },
        businessDetails: {
          type: faker.company.catchPhrase(),
          name: faker.company.catchPhrase(),
          cacNumber: faker.company.catchPhrase(),
          state: faker.address.state(),
          lga: faker.address.state(),
          address: {
            lat: 324.43,
            long: 2424.42,
            label: faker.address.country(),
          },
        },
        paymentDetails: {
          accountNumber: '456789000987',
          bank: faker.company.catchPhrase(),
          accountName: [
            faker.name.firstName(),
            faker.name.lastName(),
          ].join(' '),
          payoutFrequency: 5,
        },
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    });
  });

  describe('Login', () => {
    it('login client', async () => {
      const res = await server.post('/v1/login').send({
        email: userClient.email,
        password: userClient.password,
        type: ACCOUNT_TYPES.CUSTOMER,
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
      userClient.accountId = res.body.data.account._id;
    });
    it('login client', async () => {
      const res = await server.post('/v1/buyer/login').send({
        email: userClient.email,
        password: userClient.password,
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
      userClient.accountId = res.body.data.account._id;
    });
    it('login admin', async () => {
      await createAccountReturnToken(adminData);
      const res = await server.post('/v1/admin/login').send({
        email: adminData.email,
        password: adminData.password,
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    });
    it('login vendor', async () => {
      const res = await server.post('/v1/vendor/login').send({
        email: userBusiness.email,
        password: userBusiness.password,
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
      userBusiness.accountId = res.body.data.account._id;
    });
  });
});

describe('Email verification', () => {
  it('login client', async () => {
    const res = await server.post('/v1/login').send({
      email: userClient.email,
      password: userClient.password,
      type: ACCOUNT_TYPES.CUSTOMER,
    });

    console.log(res.body, res.error);
    assert.equal(res.status, 200);
    userClient.accountId = res.body.data.account._id;
  });

  it('email verify client', async () => {
    const { token } = await getToken(userClient);
    const res = await server
      .post('/v1/verify-email')
      .set({ Authorization: `Bearer ${userClient.$verifyToken}` })
      .send({
        code: token,
      });

    console.log(res.body, res.error);
    assert.equal(res.status, 200);
    documentation.addEndpoint(res);
  });
});

describe('Login', () => {
  it('login client', async () => {
    const res = await server.post('/v1/login').send({
      email: userClient.email,
      password: userClient.password,
      type: ACCOUNT_TYPES.CUSTOMER,
    });

    console.log(res.body, res.error);
    assert.equal(res.status, 200);
    documentation.addEndpoint(res);
    // userClient.accountId = res.body.data._id;
  });
});

describe('Forgot Password', () => {
  it('forgot password client', async () => {
    const res = await server.post('/v1/forgot-password').send({
      email: userClient.email,
      type: ACCOUNT_TYPES.CUSTOMER,
    });

    console.log(res.body, res.error);
    assert.equal(res.status, 200);
    userClient.resetToken = res.body.data.token;
    documentation.addEndpoint(res);
  });
});

describe('Reset Password', () => {
  it('reset password client', async () => {
    const password = '12345rrr';
    const { token } = getToken(userClient, TOKEN_FLAG.RESET);
    const res = await server
      .post('/v1/reset-password')
      .set({ Authorization: `Bearer ${userClient.resetToken}` })
      .send({
        code: token || '12345',
        confirmPassword: password,
        password,
      });

    console.log(res.body, res.error);
    assert.equal(res.status, 200);
    documentation.addEndpoint(res);
    // userClient.accountId = res.body.data._id;
  });
});

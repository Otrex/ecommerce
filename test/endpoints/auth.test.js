const supertest = require('supertest');
const app = require('../../src/app');
const faker = require('faker');
const { getToken } = require('../utils');
const { ACCOUNT_TYPES } = require('../../src/constants');
const { documentation } = require('../setup');
const { assert } = require('chai');

const server = supertest(app);
const userClient = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const userBusiness = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('Authentication', () => {
  describe('Registration', () => {
    it('register client', async () => {
      const res = await server.post('/v1/auth/buyer/register').send({
        ...userClient,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: 'male',
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    });

    it('register business', async () => {
      const res = await server.post('/v1/auth/vendor/register').send({
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
      const res = await server.post('/v1/auth/login').send({
        ...userClient,
        type: ACCOUNT_TYPES.CUSTOMER,
      });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
      userClient.accountId = res.body.data.account._id;
    });
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
    assert.equal(res.status, 200);
    documentation.addEndpoint(res);
  });
});

// describe('Login', () => {
//   it('login client', async () => {
//     const res = await server.post('/v1/auth/login').send({
//       ...userClient,
//       type: ACCOUNT_TYPES.CUSTOMER,
//     });

//     console.log(res.body, res.error);
//     assert.equal(res.status, 200);
//     documentation.addEndpoint(res);
//     // userClient.accountId = res.body.data._id;
//   });
// });

describe('Forgot Password', () => {
  it('forgot password client', async () => {
    const res = await server.post('/v1/auth/forgot-password').send({
      ...userClient,
      type: ACCOUNT_TYPES.CUSTOMER,
    });

    console.log(res.body, res.error);
    assert.equal(res.status, 200);
    userClient.resetToken = res.body.token;
    documentation.addEndpoint(res);
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

    assert.equal(res.status, 200);
    console.log(res.body);
    documentation.addEndpoint(res);
    // userClient.accountId = res.body.data._id;
  });
});

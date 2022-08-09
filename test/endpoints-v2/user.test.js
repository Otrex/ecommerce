const { createAccountReturnToken } = require('../utils');
const app = require('../../src/app');
const faker = require('faker');
const supertest = require('supertest');
const models = require('../../src/http/models');
const { ACCOUNT_TYPES } = require('../../src/constants');

const { documentation } = require('../setup');
const { assert } = require('chai');

const server = supertest(app);

const userCustomer = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.CUSTOMER,
};

const userBusiness = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.BUSINESS,
};

const adminData = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.ADMIN,
  isSuperAdmin: true,
};

let buyer;
let admin;
let vendor;
let categories;

before(async () => {
  vendor = await createAccountReturnToken(userBusiness);
  buyer = await createAccountReturnToken(userCustomer);
  admin = await createAccountReturnToken(adminData);
  categories = await models.Category.find({});
});

describe('User Update test', () => {
  it('should update vendors address', async () => {
    const res = await server
      .patch('/v2/users/address')
      .set({ Authorization: `Bearer ${vendor.token}` })
      .send({
        fullAddress: faker.address.streetAddress(),
        country: faker.address.country(),
        long: faker.address.longitude(),
        street: faker.address.streetAddress(),
        lat: faker.address.latitude(),
        state: faker.address.state(),
      });
  });

  it('should update vendors address', async () => {
    const res = await server
      .patch('/v2/users/address')
      .set({ Authorization: `Bearer ${buyer.token}` })
      .send({
        fullAddress: faker.address.streetAddress(),
        country: faker.address.country(),
        long: faker.address.longitude(),
        street: faker.address.streetAddress(),
        lat: faker.address.latitude(),
        state: faker.address.state(),
      });

    documentation.addEndpoint(res, {
      tags: ['V2/User'],
    });
  });

  it('should update vendors profile', async () => {
    const res = await server
      .patch('/v2/users/vendors')
      .set({ Authorization: `Bearer ${vendor.token}` })
      .send({
        "sellerDetails": {
          "phoneNumber": "+2345678765456",
          "fullName": "Carlo Feest"
        },
        "businessDetails": {
          "type": "Realigned contextually-based structure",
          "name": "Quality-focused zero tolerance attitude",
          "cacNumber": "Virtual web-enabled forecast",
          "state": "Texas",
          "lga": "Illinois",
        },
        "paymentDetails": {
          "accountNumber": "456789000987",
          "bank": "Stand-alone transitional groupware",
          "accountName": "Conrad Lesch",
          "payoutFrequency": 5
        }
      });

    documentation.addEndpoint(res, {
      tags: ['V2/User/Update'],
    });
  });

  it('should update vendors profile', async () => {
    const res = await server
      .patch('/v2/users/customer-data')
      .set({ Authorization: `Bearer ${buyer.token}` })
      .send({
        "firstName": "Clovis",
        "lastName": "Weber",
        "gender": "male"
      });

    documentation.addEndpoint(res, {
      tags: ['V2/User/Update'],
    });
  });

  it('should get user details', async () => {
    const res = await server
      .get('/v2/users/me')
      .set({ Authorization: `Bearer ${buyer.token}` });

    documentation.addEndpoint(res, {
      tags: ['V2/User/Me'],
    });
  });

  it('should get profile', async () => {
    const res = await server
      .get('/v2/users/profile')
      .set({ Authorization: `Bearer ${vendor.token}` });

    documentation.addEndpoint(res, {
      tags: ['V2/User/Profile'],
    });
  });
});

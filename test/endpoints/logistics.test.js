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

describe('Logistics', () => {
  describe('for logistics', () => {
    it('add logistics companies', async () => {
      const res = await server
        .post('/v1/admin/logistics/new')
        .set({ Authorization: `Bearer ${admin.token}` })
        .send({
          name: faker.name.findName(),
          description: faker.random.words(5),
          costPerUnit: 2,
        });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Logistics/Admin'],
      });
    });

    it('get all logistics companies', async () => {
      const res = await server
        .get('/v1/vendor/logistics')
        .set({ Authorization: `Bearer ${vendor.token}` });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Logistics/Vendor'],
      });
    });
  });
});

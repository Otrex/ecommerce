const { createAccountReturnToken } = require('../utils');
const app = require('../../src/app');
const faker = require('faker');
const supertest = require('supertest');
const models = require('../../src/http/models');
const {
  ACCOUNT_TYPES,
  PRODUCT_STATUS,
} = require('../../src/constants');

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
let products;
let categories;

before(async () => {
  categories = await models.Category.find({});
  buyer = await createAccountReturnToken(userCustomer);
  vendor = await createAccountReturnToken(userBusiness, { name: 'Benjamin' });
  admin = await createAccountReturnToken(adminData);
  business = await models.Business.findOne({
    accountId: vendor.account._id,
  });
  products = await Promise.all(
    [
      {
        creatorId: business._id,
        imageUrl: faker.image.imageUrl(),
        name: faker.lorem.words(),
        categoryId: categories[0]._id,
        price: 0.05,
        weight: 20,
        quantity: 50,
        quantityLeft: 50,
        expiryDate: new Date(),
        minimumOrder: 2,
        handlingFee: 10,
        description: faker.lorem.sentences(),
        status: PRODUCT_STATUS.APPROVED,
      },
      {
        creatorId: business._id,
        imageUrl: faker.image.imageUrl(),
        name: faker.lorem.words(),
        categoryId: categories[0]._id,
        price: 0.05,
        weight: 20,
        quantity: 50,
        quantityLeft: 50,
        expiryDate: new Date(),
        minimumOrder: 2,
        handlingFee: 10,
        description: faker.lorem.sentences(),
        status: PRODUCT_STATUS.APPROVED,
      },
    ].map((p) => models.Product.create(p))
  );
});

describe('User', () => {
  describe('Add to User', () => {
    it('search for businesses', async () => {
      const res = await server
        .get('/v1/admin/users/businesses/search?query=Benjamin&page=1&limit=20')
        .set({ Authorization: `Bearer ${admin.token}` })
        .send({});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Admin/Search'],
      });
    });
  });

  describe('Logistics Test', () => {
    it('search for businesses', async () => {
      const res = await server
        .get('/v1/admin/users/businesses/search?query=Benjamin&page=1&limit=20')
        .set({ Authorization: `Bearer ${admin.token}` })
        .send({});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Admin/Search'],
      });
    });
  });
});

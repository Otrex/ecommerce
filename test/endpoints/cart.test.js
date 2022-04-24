const { createAccountReturnToken } = require("../utils");
const app = require('../../src/app');
const faker = require('faker');
const supertest = require('supertest');
const models = require('../../src/http/models');
const { ACCOUNT_TYPES, PRODUCT_STATUS } = require('../../src/constants')

const { documentation } = require('../setup');
const { assert } = require('chai');

const server = supertest(app);

const userCustomer = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.CUSTOMER
};

const userBusiness = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.BUSINESS
};

let buyer;
let vendor;
let products;
let categories;
before(async () => {
  categories = await models.Category.find({});
  buyer = await createAccountReturnToken(userCustomer);
  vendor = await createAccountReturnToken(userBusiness);
  products = await Promise.all( [
    {
      creatorId: vendor.account._id,
      imageUrl: faker.image.imageUrl(),
      name: faker.lorem.words(),
      categoryId: categories[0]._id,
      price: 10000,
      weight: 20,
      quantity: 50,
      quantityLeft: 50,
      expiryDate: new Date(),
      minimumOrder: 2,
      handlingFee: 10,
      description: faker.lorem.sentences(),
      status: PRODUCT_STATUS.APPROVED
    },
    {
      creatorId: vendor.account._id,
      imageUrl: faker.image.imageUrl(),
      name: faker.lorem.words(),
      categoryId: categories[0]._id,
      price: 10000,
      weight: 20,
      quantity: 50,
      quantityLeft: 50,
      expiryDate: new Date(),
      minimumOrder: 2,
      handlingFee: 10,
      description: faker.lorem.sentences(),
      status: PRODUCT_STATUS.APPROVED
    }
  ].map(p => models.Product.create(p)) );
});

describe('Cart', () => {
  describe('Add to Cart', () => {
    it('create product', async () => {
      const res = await server.put('/v1/buyer/cart')
        .set({'Authorization': `Bearer ${buyer.token}`})
        .send({
          productId: products[0]._id,
          quantity: 10
        });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    });

    it('get carts items saved', async () => {
      const res = await server.get('/v1/buyer/cart')
        .set({'Authorization': `Bearer ${buyer.token}`});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    })
  });
});
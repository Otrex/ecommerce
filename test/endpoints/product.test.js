const { createAccountReturnToken } = require("../utils");
const app = require('../../src/app');
const faker = require('faker');
const supertest = require('supertest');
const models = require('../../src/http/models');
const { ACCOUNT_TYPES } = require('../../src/constants')

const { documentation } = require('../setup');
const { assert } = require('chai');

const server = supertest(app);

const userBusiness = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  type: ACCOUNT_TYPES.BUSINESS
};

let result;
let categories;
before(async () => {
  result = await createAccountReturnToken(userBusiness);
  categories = await models.Category.find({});
  console.log(categories);
});

describe('Product', () => {
  // const {
  //   token: businessToken,
  //   // account: businessAccount 
  // } = result;
  describe('Categories', () => { 
    it('get categories', async () => {
      const res = await server.get('/v1/info/categories')
        .set({'Authorization': `Bearer ${result.token}`});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    })
  });
  describe('Product', () => {
    it('create product', async () => {
      const res = await server.post('/v1/products')
        .set({'Authorization': `Bearer ${result.token}`})
        .send({
          imageUrl: faker.image.imageUrl(),
          name: faker.commerce.productName(),
          categoryId: categories[0]._id.toString(),
          price: 500,
          weight: 30,
          quantity: 10,
          expiryDate: new Date(),
          minimumOrder: 0,
          handlingFee: 10,
          description: faker.lorem.sentences(),
        });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    });

    it('get products', async () => {
      const res = await server.get('/v1/products?status=approved,disapproved,pending&page=1&limit=20')
        .set({'Authorization': `Bearer ${result.token}`});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res);
    })
  });

  
});
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
let result;
let categories;
before(async () => {
  result = await createAccountReturnToken(userBusiness);
  buyer = await createAccountReturnToken(userCustomer);
  admin = await createAccountReturnToken(adminData);
  categories = await models.Category.find({});
});

describe('Product', () => {
  describe('Categories', () => {
    it('get categories', async () => {
      const res = await server
        .get('/v1/info/categories')
        .set({ Authorization: `Bearer ${result.token}` });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Categories'],
      });
    });

    it('add categories', async () => {
      const res = await server
        .post('/v1/info/admin/categories')
        .set({ Authorization: `Bearer ${admin.token}` })
        .send({
          name: faker.lorem.words(),
        });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Categories/Admin'],
      });
    });
  });
  describe('Product', () => {
    let product;
    it('create product', async () => {
      const res = await server
        .post('/v1/vendor/products')
        .set({ Authorization: `Bearer ${result.token}` })
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
      product = res.body.data;
      documentation.addEndpoint(res, {
        tags: ['Product/Vendor'],
      });
    });

    it('it should approve product', async () => {
      const res = await server
        .post(`/v1/admin/products/${product._id}/approve`)
        .set({ Authorization: `Bearer ${admin.token}` })
        .send({});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Admin'],
        pathParameters: [
          {
            index: 3,
            name: 'productId',
          },
        ],
      });
    });

    it('it should disapprove product', async () => {
      const res = await server
        .post(`/v1/admin/products/${product._id}/disapprove`)
        .set({ Authorization: `Bearer ${admin.token}` })
        .send({
          reason: 'this is because it is the best',
        });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Admin'],
        pathParameters: [
          {
            index: 3,
            name: 'productId',
          },
        ],
      });
    });

    it('add feedback to product', async () => {
      const res = await server
        .post(`/v1/buyer/products/${product._id}/feedback`)
        .set({ Authorization: `Bearer ${buyer.token}` })
        .send({
          comment: faker.lorem.sentences(),
          rating: 4,
        });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Buyer'],
        pathParameters: [
          {
            index: 3,
            name: 'productId',
          },
        ],
      });
    });

    it('it should like product', async () => {
      const res = await server
        .post(`/v1/buyer/products/${product._id}/like`)
        .set({ Authorization: `Bearer ${buyer.token}` })
        .send({});

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Buyer'],
        pathParameters: [
          {
            index: 3,
            name: 'productId',
          },
        ],
      });
    });

    it('it get product details', async () => {
      const res = await server.get(
        `/v1/public/products/${product._id}`
      );

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product'],
        pathParameters: [
          {
            index: 3,
            name: 'productId',
          },
        ],
      });
    });

    it('it get product details', async () => {
      const res = await server.get(
        '/v1/public/products?page=1&limit=20'
      );

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product'],
      });
    });

    it('get favorite products', async () => {
      const res = await server
        .get('/v1/buyer/products/favorites?page=1&limit=20')
        .set({ Authorization: `Bearer ${buyer.token}` });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Buyer'],
      });
    });

    it('get products', async () => {
      const res = await server
        .get(
          '/v1/vendor/products?status=approved,disapproved,pending&page=1&limit=20'
        )
        .set({ Authorization: `Bearer ${result.token}` });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Vendor'],
      });
    });

    it('get products feedback', async () => {
      const res = await server
        .get('/v1/vendor/products/feedback')
        .set({ Authorization: `Bearer ${result.token}` });

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product/Vendor'],
      });
    });

    it('get products by categories', async () => {
      const res = await server.get(
        `/v1/public/categories/${categories[0]._id.toString()}/products?page=1&limit=20`
      );

      console.log(res.body, res.error);
      assert.equal(res.status, 200);
      documentation.addEndpoint(res, {
        tags: ['Product'],
        pathParameters: [
          {
            index: 3,
            name: 'categoryId',
          },
        ],
      });
    });
  });
});

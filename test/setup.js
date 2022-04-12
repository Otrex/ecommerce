const Documentator = require('../src/scripts/documentator');
const { seed } = require('../src/scripts/seeds');
const { connection } = require('mongoose');
const { DB } = require('../src/database');
const nock = require('nock');

const db = new DB();
const documentation = Documentator.getInstance();
const mochaHooks = {
  async beforeAll() {
    // await seed();
    await db.connect();
  },

  async afterAll() {
    documentation.renderDocumentation();
    await connection.dropDatabase();
    await db.disconnect();
  },

  afterEach() {
    if (!nock.isDone()) {
      global.console.error(
        'Not all nock interceptors were used',
        nock.pendingMocks(),
      );
      nock.cleanAll();
    }
  },
};

module.exports = {
  documentation,
  mochaHooks
}

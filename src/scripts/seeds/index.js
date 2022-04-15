const seeder = require('mongoose-seed');
const Account = require('../../http/models/Account')
const { dbUri } = require('../../database');
const config = require('../../config');
const bcryptHash = require('../utils');
const models = ['admin', 'ItemWeight'];

const data = [
  {
    model: 'ItemCategory',
    documents: require('./data/itemCategory.js'),
  },
  {
    model: 'ItemWeight',
    documents: require('./data/itemWeight.js'),
  },
];

exports.seed = () => {
  seeder.connect(dbUri, () => {
    seeder.loadModels(models.map((model) => `./src/models/${model}.js`));

    seeder.clearModels(models, () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      });
    });
  });
};

exports.seedAdmin = async () => {
  let account = await Account.findOne({
    email: config.admin.email
  });

  if (!account) {
    account = await Account.create({
      isSuperAdmin: true,
      email: config.admin.email,
      password: '1234',
    })
  }

  await Account.findByIdAndUpdate(account._id, {
    password: await bcryptHash(config.admin.password),
  })
}

if (require.main === module) {
  seedAdmin();
  seed();
}

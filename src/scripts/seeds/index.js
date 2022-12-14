const seeder = require('mongoose-seed');
const { DB } = require('../../database');
const Account = require('../../http/models/Account');
const Category = require('../../http/models/Category');
const { dbUri } = require('../../database');
const config = require('../../config');
const { bcryptHash } = require('../utils');
const models = ['Category'];

// const data = [
//   {
//     model: 'Category',
//     documents: require('./data/categories.js'),
//   },
// ];

// exports.seed = () => {
//   seeder.connect(dbUri, () => {
//     seeder.loadModels(
//       models.map((model) => `./src/http/models/${model}.js`)
//     );

//     seeder.clearModels(models, () => {
//       seeder.populateModels(data, () => {
//         seeder.disconnect();
//       });
//     });
//   });
// };

const checkOrInsert = async (model, data) => {
  const d = await model.findOne(data);
  if (!d) await model.create(data);
};

const categories = require('./data/categories.js');
const Logistics = require('../../http/models/Logistics');
exports.seedCategories = async () => {
  await Promise.all(
    categories.map((cat) => checkOrInsert(Category, cat))
  );
};

const logisticsCompanies = require('./data/logisticsCompanies');
const { ACCOUNT_TYPES } = require('../../constants');
exports.seedLogistics = async () => {
  await Promise.all(
    logisticsCompanies.map((log) => checkOrInsert(Logistics, log))
  );
};

exports.seedAdmin = async () => {
  let account = await Account.findOne({
    email: config.admin.email,
  });

  if (!account) {
    account = await Account.create({
      isSuperAdmin: true,
      isEmailVerified: true,
      type: ACCOUNT_TYPES.ADMIN,
      password: await bcryptHash(config.admin.password),
      emailVerifiedAt: new Date(),
      email: config.admin.email,
    });
  }
};

if (require.main === module) {
  const db = new DB();
  db.connect()
    .then(async () => {
      await exports.seedAdmin();
      await exports.seedCategories();
      await exports.seedLogistics();
      console.log('Seeding Completed');
    })
    .catch(console.error)
    .finally(() => process.exit(-1));
  // seed();
}

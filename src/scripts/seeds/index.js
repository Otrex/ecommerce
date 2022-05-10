const seeder = require('mongoose-seed');
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
exports.seedCategories = async () => {
  await Promise.all(
    categories.map((cat) => checkOrInsert(Category, cat))
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
      emailVerifiedAt: new Date(),
      email: config.admin.email,
      password: '1234',
    });
  }

  await Account.findByIdAndUpdate(account._id, {
    password: await bcryptHash(config.admin.password),
  });
};

if (require.main === module) {
  seedAdmin();
  seedCategories();
  // seed();
}

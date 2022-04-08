const seeder = require('mongoose-seed');
const { dbUri } = require('../../database');

const models = ['ItemCategory', 'ItemWeight'];

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

if (require.main === module) {
  seed();
}

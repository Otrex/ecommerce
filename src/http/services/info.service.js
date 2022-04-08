const models = require('../models');

class InfoService {
  static getCategories = async () => ({
    data: await models.ItemCategory.find({}),
  });

  static getWeights = async () => ({
    data: await models.ItemWeight.find({}),
  });
}

module.exports = InfoService;

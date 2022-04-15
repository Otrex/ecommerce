const models = require('../models');

class InfoService {
  static getCategories = async () => ({
    data: await models.Category.find({}),
  });
  static addCategory = async ({ name }) => ({
    data: await models.Category.create({
      name,
    }),
  });
}

module.exports = InfoService;

const models = require('../models');

class InfoService {
  static getCategories = async () => ({
    data: await models.Category.find({}),
  });
  static addCategory = async ({ name, description }) => ({
    data: await models.Category.create({
      name,
      description,
    }),
  });
}

module.exports = InfoService;

const RequestHandler = require('.');
const InfoService = require('../services/info.service');

class InfoController {
  static getCategories = RequestHandler({
    handler: InfoService.getCategories,
  });

  static getWeights = RequestHandler({
    handler: InfoService.getWeights,
  });
}

module.exports = InfoController;

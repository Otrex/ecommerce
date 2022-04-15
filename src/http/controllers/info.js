const RequestHandler = require('.');
const InfoService = require('../services/info.service');
const {
  AddCategoryValidator,
  SignedURLValidator,
} = require('../validators');
const FileService = require('../services/file.service');

class InfoController {
  static getCategories = RequestHandler({
    handler: InfoService.getCategories,
  });

  static addCategory = RequestHandler({
    validator: AddCategoryValidator,
    handler: InfoService.addCategory,
  });

  static generateSignedURL = RequestHandler({
    validator: SignedURLValidator,
    handler: FileService.fileHandler,
  });
}

module.exports = InfoController;

const RequestHandler = require('.');
const DropOffService = require('../services/dropoff.service');
const { CreateDropOffValidator } = require('../validators');

class DropOffController {
  static createDropOff = RequestHandler({
    validator: CreateDropOffValidator,
    handler: DropOffService.createDropOff,
  });
}

module.exports = DropOffController;

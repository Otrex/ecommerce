const RequestHandler = require('.');
const WaitingListService = require('../services/waiting-list.service');
const { AddToWaitingListValidator } = require('../validators');

class WaitingListController {
  static addToWaitingList = RequestHandler({
    validator: AddToWaitingListValidator,
    handler: WaitingListService.addToWaitingList,
  });
}

module.exports = WaitingListController;

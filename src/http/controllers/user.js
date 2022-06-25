const RequestHandler = require('.');
const UserService = require('../services/user.service');
const {
  GetAccountValidator,
  GetBusinessesPaginationValidator,
} = require('../validators');

class UserController {
  static suspendUser = RequestHandler({
    validator: GetAccountValidator,
    handler: UserService.suspendUser,
  });

  static unsuspendUser = RequestHandler({
    validator: GetAccountValidator,
    handler: UserService.unsuspendUser,
  });

  static searchForBusinesses = RequestHandler({
    validator: GetBusinessesPaginationValidator,
    handler: UserService.searchForBusiness,
  });
}

module.exports = UserController;

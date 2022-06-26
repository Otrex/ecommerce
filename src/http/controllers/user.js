const RequestHandler = require('.');
const UserService = require('../services/user.service');
const {
  GetAccountValidator,
  GetAccountPaginationValidator,
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

  static getCustomersData = RequestHandler({
    validator: GetAccountPaginationValidator,
    handler: UserService.getCustomersData,
  });

  static getBusinesses = RequestHandler({
    validator: GetAccountPaginationValidator,
    handler: UserService.getBusinesses,
  });
}

module.exports = UserController;

const RequestHandler = require('.');
const UserService = require('../services/user.service');
const {
  UpdateAddressValidator,
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

  static updateAddress = RequestHandler({
    validator: UpdateAddressValidator,
    handler: UserService.setAddress,
  });
}

module.exports = UserController;

const RequestHandler = require('.');
const UserService = require('../services/user.service');
const {
  UpdateAddressValidator,
  GetAccountValidator,
  UpdateCustomerValidator,
  GetAccountPaginationValidator,
  UpdateBusinessValidator,
  GetBusinessesPaginationValidator,
} = require('../validators');

class UserController {
  static getMe = RequestHandler({
    handler: UserService.getMe,
  });

  static getProfile = RequestHandler({
    handler: UserService.getProfile,
  });

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

  static updateCustomer = RequestHandler({
    validator: UpdateCustomerValidator,
    handler: UserService.updateCustomerDetails,
  });

  static updateBusiness = RequestHandler({
    validator: UpdateBusinessValidator,
    handler: UserService.updateBusinessDetails,
  });
}

module.exports = UserController;

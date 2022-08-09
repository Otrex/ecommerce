const Router = require('../../../core/Router');
const UserController = require('../../controllers/user');

class UserRouter extends Router {
  $baseRoute = '/users';

  register() {
    this.$router.use(this.$middleware.authentication());
    this.$router.get('/me', UserController.getMe);
    this.$router.get(
      '/profile',
      this.$middleware.authorization([
        this.CONSTANTS.ACCOUNT_TYPES.CUSTOMER,
        this.CONSTANTS.ACCOUNT_TYPES.BUSINESS,
      ]),
      UserController.getProfile
    );
    this.$router
      .route('/vendors')
      .get(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.ADMIN,
        ]),
        UserController.getBusinesses
      )
      .patch(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.BUSINESS,
        ]),
        UserController.updateBusiness
      );

    this.$router
      .route('/customer-data')
      .get(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.ADMIN,
        ]),
        UserController.getCustomersData
      )
      .patch(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.CUSTOMER,
        ]),
        UserController.updateCustomer
      );

    this.$router
      .route('/address')
      .patch(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.CUSTOMER,
          this.CONSTANTS.ACCOUNT_TYPES.BUSINESS,
        ]),
        UserController.updateAddress
      );

    return this;
  }
}

module.exports = new UserRouter();

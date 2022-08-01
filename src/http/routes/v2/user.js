const Router = require('../../../core/Router');
const UserController = require('../../controllers/user');

class UserRouter extends Router {
  $baseRoute = '/users';

  register() {
    this.$router.use(this.$middleware.authentication());
    this.$router
      .route('/vendors')
      .get(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.ADMIN,
        ]),
        UserController.getBusinesses
      );

    this.$router
      .route('/customer-data')
      .get(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.ADMIN,
        ]),
        UserController.getCustomersData
      );

    this.$router.route('/address')
      .patch(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.CUSTOMER,
          this.CONSTANTS.ACCOUNT_TYPES.BUSINESS,
        ]),
        UserController.updateAddress
      )

    return this;
  }
}

module.exports = new UserRouter();

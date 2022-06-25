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

    return this;
  }
}

module.exports = new UserRouter();
